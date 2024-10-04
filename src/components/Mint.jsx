//const fs = require('fs'); // Add this line to require the 'fs' module

import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');
const  { createMint, mintTo, getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');

const { getKeypairFromEnvironment, getExplorerLink }=require("@solana-developers/helpers");
const { createCreateMetadataAccountV3Instruction }=require("@metaplex-foundation/mpl-token-metadata");


const BN = require('bn.js'); // Import BN from the 'bn.js' library

// Load the wallet's secret key from users.json
 // Update this line
 export const Mint =({wallet}) =>{
    const { publicKey } = useWallet();
//const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray)); // Use the secret key array

// Configure connection to the Solana cluster
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Replace with your mint address if it already exists
const mintAddress = null;

async function addMetadata(tokenMintAccount) {
 
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
      console.log("user",TOKEN_METADATA_PROGRAM_ID.toBase58());

    const metadataData = {
        name: "Not Not coin",
        symbol: "NNOT",
        // Paste in your JSON file Arweave link using Metaplex standard for off-chain data
        uri: "https://arweave.net/tQ0E2wu869poiv01OQGaMKMs9fHsl8HCKvAJqvRfLmU",
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
    };
    
    const metadataPDAAndBump = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            tokenMintAccount.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );
    
    const metadataPDA = metadataPDAAndBump[0];
    
    const transaction = new Transaction();

const createMetadataAccountInstruction =
    createCreateMetadataAccountV3Instruction(
        {
            metadata: metadataPDA,
            mint: tokenMintAccount,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            updateAuthority: wallet.publicKey,
        },
        {
            createMetadataAccountArgsV3: {
                collectionDetails: null,
                data: metadataData,
                isMutable: true,
            },
        }
    );

transaction.add(createMetadataAccountInstruction);

const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [wallet]
);

const transactionLink = getExplorerLink(
    "transaction",
    transactionSignature,
    "devnet"
);

console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink} !`);

const tokenMintLink = getExplorerLink(
    "address",
    tokenMintAccount.toString(),
    "devnet"
);

console.log(`✅ Look at the token mint again: ${tokenMintLink} !`);
}
    
async function mintToken() {
    try {
        // Create a new token mint if needed
        let mint;
        if (!mintAddress) {
            mint = await createMint(
                connection,
                wallet,
                wallet.publicKey,
                wallet.publicKey,
                9
            );
            console.log('Mint address:', mint.toBase58());
        } else {
            
            console.log('check mint add= null');
        }

        // Create an associated token account for the recipient (wallet)
        const  associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            mint,
            wallet.publicKey
          );
  
        // Amount to mint
        const tokenDecimal = 9;
        const amount = 10000000000n;//new BN(1000000000).mul(new BN(10 ** tokenDecimal))

        console.log("wallet:",wallet.publicKey.toBase58());

        // Mint tokens
        const mintTx = await mintTo(
            connection,
            wallet,
            mint,
            associatedTokenAccount.address,
            wallet.publicKey,
            amount,
            [],
            []
        );

        console.log('Tokens minted successfully!', mintTx);
        await addMetadata(mint);
    } catch (error) {
        console.error('Error minting tokens:', error);
    }

   // await addMetadata(mint.toBase58());
}


mintToken();
 }

// Run the mint function

