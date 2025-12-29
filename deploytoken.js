const solanaWeb3 = require("@solana/web3.js");
const splToken = require("@solana/spl-token");
const bs58 = require("bs58");

// Converted Paste here
const phantomKeyBase58 = "";
const secretKey = bs58.default.decode(phantomKeyBase58);
const wallet = solanaWeb3.Keypair.fromSecretKey(secretKey);

(async () => {
  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("devnet"), "confirmed");

  console.log("Wallet public key:", wallet.publicKey.toBase58());

  // Create new SPL token
  const mint = await splToken.createMint(
    connection,
    wallet,           // payer
    wallet.publicKey, // mint authority
    null,             // freeze authority (optional)
    9                 // decimals
  );

  console.log("Token Mint Address:", mint.toBase58());

  // Create associated token account for yourself
  const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    mint,
    wallet.publicKey
  );

  console.log("Your Token Account Address:", tokenAccount.address.toBase58());

  // Mint some tokens to yourself
const amount = 500_000_000 * 10 ** 9; // 500 million tokens with 9 decimals
await splToken.mintTo(
  connection,
  wallet,
  mint,
  tokenAccount.address,
  wallet,
  amount
);

  console.log("Minted 500 million tokens successfully!");
})();
