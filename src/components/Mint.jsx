//const fs = require('fs'); // Add this line to require the 'fs' module

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
//import { createMint,    mintTo,    getOrCreateAssociatedTokenAccount} from '@solana/spl-token';
import {
    createMint,
    mintTo,
    getOrCreateAssociatedTokenAccount,
addMetadata} from './BrowserExt';


const BN = require('bn.js'); // Import BN from the 'bn.js' library

const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');

export const Mint =() =>{

// Load the wallet's secret key from users.json
 // Update this line

    const { publicKey } = useWallet();
//const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray)); // Use the secret key array
const wallet = publicKey;
// Configure connection to the Solana cluster
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Replace with your mint address if it already exists
const mintAddress = null;

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


//mintToken();

return (<div>
    <h1 style={{ color: 'white' }}>
      
    <button onClick={mintToken}>mintToken</button><br/>
                    {publicKey ? `Wallet is connected: ${publicKey?.toBase58()}` : `No wallet connected.`}
                    </h1>
    </div>)
 }

// Run the mint function

