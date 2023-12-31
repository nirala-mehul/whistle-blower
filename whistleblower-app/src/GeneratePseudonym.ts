var forge = require("node-forge");
var ed25519 = forge.pki.ed25519;

export function GeneratePseudonym(address: string) {
  const secret: string = process.env.PRIVATE_KEY ?? "";
  var seed = Buffer.from(address+secret, "utf8");
  var keypair = ed25519.generateKeyPair({ seed: seed });

  const { publicKey, privateKey } = keypair;

  const hexChunks = address.match(/.{1,2}/g) || [];
  const bytesBuffer = Buffer.from(
    hexChunks.map((chunk) => parseInt(chunk, 16)) as any,
    "utf8",
  );

  var signature = ed25519
    .sign({
      message: bytesBuffer,
      privateKey: privateKey,
    })
    .toString("hex");

  return { publicKey: publicKey.toString("hex"), signature: signature };
}
