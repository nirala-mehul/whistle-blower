import { Buffer } from "buffer";
import PartisiaSdk from "partisia-sdk";
import { CLIENT, Context } from "../context";
import { TransactionApi } from "../client/TransactionApi";
import { serializeTransaction } from "../client/TransactionSerialization";
import { ConnectedWallet } from "../client/ConnectedWallet";
import { BigEndianByteOutput } from "@secata-public/bitmanipulation-ts";
import { Rpc, TransactionPayload } from "../client/TransactionData";
import { ec } from "elliptic";
import { CryptoUtils } from "../client/CryptoUtils";
import { useContext, useState } from "react";
import { Stack, Button, Modal, TextField, Typography } from "@mui/material";
import { MPCWalletLogo } from "../icons/mpc-logo";

interface MetamaskRequestArguments {
  /** The RPC method to request. */
  method: string;
  /** The params of the RPC method, if any. */
  params?: unknown[] | Record<string, unknown>;
}

interface MetaMask {
  request<T>(args: MetamaskRequestArguments): Promise<T>;
}

/**
 * Structure of the raw data from a WASM contract.
 */
// interface RawContractData {
//   state: { data: string };
// }

export default function WalletConnect() {
  const { setCurrentAccount, currentAccount } = useContext(Context);
  const connectMetaMaskWalletClick = () => {
    handleWalletConnect(connectMetaMask());
  };

  /**
   * Connect to MetaMask snap and instantiate a ConnectedWallet.
   */
  const connectMetaMask = async (): Promise<ConnectedWallet> => {
    const snapId = "npm:@partisiablockchain/snap";

    if ("ethereum" in window) {
      const metamask = window.ethereum as MetaMask;

      // Request snap to be installed and connected
      await metamask.request({
        method: "wallet_requestSnaps",
        params: {
          [snapId]: {},
        },
      });

      // Get the address of the user from the snap
      const userAddress: string = await metamask.request({
        method: "wallet_invokeSnap",
        params: { snapId, request: { method: "get_address" } },
      });

      return {
        address: userAddress,
        signAndSendTransaction: async (payload, cost = 0) => {
          // To send a transaction we need some up-to-date account information, i.e. the
          // current account nonce.
          const accountData = await CLIENT.getAccountData(userAddress);
          if (accountData == null) {
            throw new Error("Account data was null");
          }
          // Account data was fetched, build and serialize the transaction
          // data.
          const serializedTx = serializeTransaction(
            {
              cost: String(cost),
              nonce: accountData.nonce,
              validTo: String(
                new Date().getTime() + TransactionApi.TRANSACTION_TTL
              ),
            },
            payload
          );

          // Request signature from MetaMask
          const signature: string = await metamask.request({
            method: "wallet_invokeSnap",
            params: {
              snapId: "npm:@partisiablockchain/snap",
              request: {
                method: "sign_transaction",
                params: {
                  payload: serializedTx.toString("hex"),
                  chainId: "Partisia Blockchain Testnet",
                },
              },
            },
          });

          // Serialize transaction for sending
          const transactionPayload = Buffer.concat([
            Buffer.from(signature, "hex"),
            serializedTx,
          ]);

          // Send the transaction to the blockchain
          return CLIENT.putTransaction(transactionPayload).then((txPointer) => {
            if (txPointer != null) {
              return {
                putSuccessful: true,
                shard: txPointer.destinationShardId,
                transactionHash: txPointer.identifier,
              };
            } else {
              return { putSuccessful: false };
            }
          });
        },
      };
    } else {
      throw new Error("Unable to find MetaMask extension");
    }
  };

  /**
   * Function for connecting to the MPC wallet and setting the connected wallet in the app state.
   */
  const connectMpcWalletClick = () => {
    // Call Partisia SDK to initiate connection
    const partisiaSdk = new PartisiaSdk();
    handleWalletConnect(
      partisiaSdk
        .connect({
          // eslint-disable-next-line
          permissions: ["sign" as any],
          dappName: "Wallet integration demo",
          chainId: "Partisia Blockchain Testnet",
        })
        .then(() => {
          const connection = partisiaSdk.connection;
          if (connection != null) {
            // User connection was successful. Use the connection to build up a connected wallet
            // in state.
            const userAccount: ConnectedWallet = {
              address: connection.account.address,
              signAndSendTransaction: (payload, cost = 0) => {
                // To send a transaction we need some up-to-date account information, i.e. the
                // current account nonce.
                return CLIENT.getAccountData(connection.account.address).then(
                  (accountData) => {
                    if (accountData == null) {
                      throw new Error("Account data was null");
                    }
                    // Account data was fetched, build and serialize the transaction
                    // data.
                    const serializedTx = serializeTransaction(
                      {
                        cost: String(cost),
                        nonce: accountData.nonce,
                        validTo: String(
                          new Date().getTime() + TransactionApi.TRANSACTION_TTL
                        ),
                      },
                      payload
                    );
                    // Ask the MPC wallet to sign and send the transaction.
                    return partisiaSdk
                      .signMessage({
                        payload: serializedTx.toString("hex"),
                        payloadType: "hex",
                        dontBroadcast: false,
                      })
                      .then((value) => {
                        return {
                          putSuccessful: true,
                          shard: CLIENT.shardForAddress(
                            connection.account.address
                          ),
                          transactionHash: value.trxHash,
                        };
                      })
                      .catch(() => ({
                        putSuccessful: false,
                      }));
                  }
                );
              },
            };
            return userAccount;
          } else {
            throw new Error("Unable to establish connection to MPC wallet");
          }
        })
        .catch((error) => {
          // Something went wrong with the connection.
          if (error instanceof Error) {
            if (error.message === "Extension not Found") {
              throw new Error("Partisia Wallet Extension not found.");
            } else if (error.message === "user closed confirm window") {
              throw new Error("Sign in using MPC wallet was cancelled");
            } else if (error.message === "user rejected") {
              throw new Error("Sign in using MPC wallet was rejected");
            } else {
              throw error;
            }
          } else {
            throw new Error(error);
          }
        })
    );
  };

  /**
   * Function for using a private key to sign and send transactions.
   */
  const connectPrivateKey = async (
    sender: string,
    keyPair: ec.KeyPair
  ): Promise<ConnectedWallet> => {
    return {
      address: sender,
      signAndSendTransaction: (payload: TransactionPayload<Rpc>, cost = 0) => {
        // To send a transaction we need some up-to-date account information, i.e. the
        // current account nonce.
        return CLIENT.getAccountData(sender).then((accountData) => {
          if (accountData == null) {
            throw new Error("Account data was null");
          }
          // Account data was fetched, build and serialize the transaction
          // data.
          const serializedTx = serializeTransaction(
            {
              cost: String(cost),
              nonce: accountData.nonce,
              validTo: String(
                new Date().getTime() + TransactionApi.TRANSACTION_TTL
              ),
            },
            payload
          );
          const hash = CryptoUtils.hashBuffers([
            serializedTx,
            BigEndianByteOutput.serialize((out) =>
              out.writeString("Partisia Blockchain Testnet")
            ),
          ]);
          const signature = keyPair.sign(hash);

          // Serialize transaction for sending
          const transactionPayload = Buffer.concat([
            CryptoUtils.signatureToBuffer(signature),
            serializedTx,
          ]);

          // Send the transaction to the blockchain
          return CLIENT.putTransaction(transactionPayload).then((txPointer) => {
            if (txPointer != null) {
              return {
                putSuccessful: true,
                shard: txPointer.destinationShardId,
                transactionHash: txPointer.identifier,
              };
            } else {
              return { putSuccessful: false };
            }
          });
        });
      },
    };
  };

  /**
   * Connect to the blockchain using a private key. Reads the private key from the form.
   */
  const connectPrivateKeyWalletClick = (privateKey: string) => {
    const keyPair = CryptoUtils.privateKeyToKeypair(privateKey);
    const sender = CryptoUtils.keyPairToAccountAddress(keyPair);
    handleWalletConnect(connectPrivateKey(sender, keyPair));
  };

  /**
   * Common code for handling a generic wallet connection.
   * @param connect the wallet connection. Can be Mpc Wallet, Metamask, or using a private key.
   */
  const handleWalletConnect = (connect: Promise<ConnectedWallet>) => {
    // Clean up state
    setCurrentAccount(undefined);
    connect
      .then((userAccount) => {
        setCurrentAccount(userAccount);
      })
      .catch((error) => {});
  };

  /**
   * Reset state to disconnect current user.
   */
  const disconnectWalletClick = () => {
    setCurrentAccount(undefined);
  };

  const [open, setOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  return currentAccount !== undefined ? (
    <div>
      <Typography gutterBottom color="primary.main">
        {currentAccount.address}
      </Typography>
    </div>
  ) : (
    <div>
      <Button onClick={() => setOpen(!open)}>Sign In</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            textAlign: "center",
            justifyContent: "center",
            p: 4,
            borderRadius: 1,
          }}
          spacing={2}
        >
          <Button
            variant="contained"
            onClick={connectMpcWalletClick}
            startIcon={<MPCWalletLogo />}
          >
            Connect MPC
          </Button>
          <Button variant="contained" onClick={connectMetaMaskWalletClick}>
            Connect Metamask
          </Button>

          <TextField
            id="private-key"
            label="Private key"
            variant="standard"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => connectPrivateKeyWalletClick(privateKey)}
          >
            Connect Private Key
          </Button>
        </Stack>
      </Modal>
    </div>
  );
}
