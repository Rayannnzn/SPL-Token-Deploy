const solanaWeb3 = require("@solana/web3.js");
const bs58 = require("bs58");

// Replace with your Phantom private key (base58 string)
const phantomKeyBase58 = "";

// Decode using .default
const secretKey = bs58.default.decode(phantomKeyBase58);
const wallet = solanaWeb3.Keypair.fromSecretKey(secretKey);

console.log("Wallet public key:", wallet.publicKey.toBase58());
