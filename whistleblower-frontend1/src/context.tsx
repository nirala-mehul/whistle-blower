import { ContractAbi, AbiParser } from "@partisiablockchain/abi-client";
import { ShardedClient } from "./client/ShardedClient";
import { TransactionApi } from "./client/TransactionApi";
import { ConnectedWallet } from "./client/ConnectedWallet";
import { WhistleblowerApi } from "./contract/WhistleblowerApi";
import {
  WhistleblowerState,
  deserializeWhistleblowerState,
} from "./contract/WhistleblowerGenerated";
import React, { useEffect, useState } from "react";
import { CONTRACT_ADDRESS } from "./constants";

export const CLIENT = new ShardedClient(
  "https://node1.testnet.partisiablockchain.com",
  ["Shard0", "Shard1", "Shard2"]
);

interface IPsuedoID {
  publicKey: string;
  psuedonym: string;
}

export interface IContext {
  contractAddress: string | undefined;
  setContractAddress: (contractAddress: string) => void;

  psuedoID: IPsuedoID;
  currentAccount: ConnectedWallet | undefined;
  setCurrentAccount: (currentAccount: ConnectedWallet) => void;

  contractAbi: ContractAbi;
  setContractAbi: (contractAbi: ContractAbi) => void;

  whistleblowerApi: WhistleblowerApi | undefined;
  setWhistleblowerApi: (whistleblowerApi: WhistleblowerApi) => void;

  contractState: WhistleblowerState;
  setContractState: (contractState: WhistleblowerState) => void;

  updateContractState: () => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;
}

interface RawContractData {
  state: { data: string };
}

export const Context = React.createContext<IContext>({} as IContext);

export function AppContextWrapper({ children }: { children: JSX.Element }) {
  const [contractAbi, setContractAbi] = useState<ContractAbi>();
  const [currentAccount, setCurrentAccount] = useState<ConnectedWallet>();
  const [contractAddress, setContractAddress] = useState<string>();
  const [whistleblowerApi, setWhistleblowerApi] = useState<WhistleblowerApi>();
  const [psuedoID, setPseudoID] = useState<IPsuedoID>();
  const [contractState, setContractState] = useState<WhistleblowerState>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateContractState = () => {
    const address = contractAddress;
    if (address === undefined) {
      throw new Error("No address provided");
    }
    CLIENT.getContractData<RawContractData>(address).then((contract) => {
      if (contract !== null) {
        // Reads the state of the contract
        if (contractAbi === undefined) {
          const abiBuffer = Buffer.from(contract.abi, "base64");
          const abi = new AbiParser(abiBuffer).parseAbi();
          setContractAbi(abi.contract);

          const stateBuffer = Buffer.from(
            contract.serializedContract.state.data,
            "base64"
          );

          const state = deserializeWhistleblowerState(
            { state: stateBuffer },
            abi.contract
          );
          setContractState(state);

          console.log(state);
        }
      } else {
        throw new Error("Could not find data for contract");
      }
    });
  };

  useEffect(() => {
    setContractAddress(CONTRACT_ADDRESS);
  }, []);

  useEffect(() => {
    if (contractAddress !== undefined) {
      updateContractState();
    }
  }, [contractAddress]);

  useEffect(() => {
    if (currentAccount !== undefined && contractAbi !== undefined) {
      const transactionApi = new TransactionApi(
        currentAccount,
        updateContractState
      );
      const _whistleblowerApi = new WhistleblowerApi(
        transactionApi,
        contractAbi,
        contractAddress
      );
      setWhistleblowerApi(_whistleblowerApi);
    }
  }, [currentAccount, contractAbi]);

  const value = {
    contractAbi,
    setContractAbi,

    currentAccount,
    setCurrentAccount,

    psuedoID,
    contractAddress,
    setContractAddress,

    whistleblowerApi,
    setWhistleblowerApi,

    contractState,
    setContractState,

    updateContractState,

    loading,
    setLoading,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
