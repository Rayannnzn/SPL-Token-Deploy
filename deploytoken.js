import {
  Connection,
  Keypair,
  clusterApiUrl,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";

// Now this will work because version 2 exports it
import {
  createCreateMetadataAccountV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";

import fs from "fs";

// Metadata program ID always stays the same
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Load your keypair from JSON
const secret = Uint8Array.from(JSON.parse(fs.readFileSync("keypair.json")));
const payer = Keypair.fromSecretKey(secret);

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

(async () => {
  try {
    console.log("Wallet:", payer.publicKey.toBase58());

    // Create a mint with 9 decimals
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey,
      null,
      9
    );
    console.log("Mint:", mint.toBase58());

    // Create associated token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );

    // Mint 1,000,000 tokens
    await mintTo(
  connection,
  payer,
  mint,
  tokenAccount.address,
  payer.publicKey,
  1_000_000_000n * 10n ** 9n
);
console.log("✅ Minted 1,000,000,000 tokens");
    // Derive PDA for metadata
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    // Build metadata instruction
    const metadataIx = createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name: "Rayan Tokens 1B" , // your name
            symbol: "DTT",            // your symbol
            uri: "",                  // optional metadata JSON URL
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
          },
          isMutable: true,
          collectionDetails: null,
        },
      }
    );

    // Send transaction
    const tx = new Transaction().add(metadataIx);
    await sendAndConfirmTransaction(connection, tx, [payer]);

    console.log("✅ Metadata created — name & symbol set!");
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
