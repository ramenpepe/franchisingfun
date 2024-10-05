//const fs = require('fs'); // Add this line to require the 'fs' module

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createMint,    mintTo,    getOrCreateAssociatedTokenAccount} from '@solana/spl-token'; import {addMetadata} from './BrowserExt';
//import { createMint, mintTo, getOrCreateAssociatedTokenAccount,addMetadata} from './BrowserExt';

import { Buffer } from 'buffer'; // Import Buffer for browser compatibility
window.Buffer = Buffer;
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


async function createMintWithLogging(connection, payer, mintAuthority, freezeAuthority, decimals) {
    // Create a new mint
    const mintInstruction = await createMint(
        connection,
        payer,
        mintAuthority,
        freezeAuthority,
        decimals
    );

    // Log the mint transaction details
    console.log("Mint Instruction:", mintInstruction);
    return mintInstruction;
}

export const Mint = () => {
    const wallet = useWallet();
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const mintAddress = null;

    async function mintToken() {
        if (!wallet || !wallet.publicKey || !wallet.connected) {
            console.error("Wallet is not connected");
            return;
        }

        try {
            let mint;
            if (!mintAddress) {
                // Create a new mint
                mint = await createMintWithLogging(
                    connection,
                    wallet,
                    wallet.publicKey,
                    wallet.publicKey,
                    9
                );
                console.log('Mint address:', mint.toBase58());
            } else {
                console.log('Mint address is null');
            }

            // Get or create an associated token account
            const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                wallet,
                mint,
                wallet.publicKey
            );

            const amount = 10000000000n;

            // Create the transaction
            const transaction = new Transaction().add(
                mintTo(
                    mint,
                    associatedTokenAccount.address,
                    wallet.publicKey,
                    amount
                )
            );

            // Log the transaction before sending
            console.log("Transaction before sending:", transaction);

            // Sign and send the transaction
            const signature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature);

            console.log('Tokens minted successfully!', signature);
            await addMetadata(mint);
        } catch (error) {
            console.error('Error minting tokens:', error);
        }
    }

    return (
        <div>
            <h1 style={{ color: 'white' }}>
                <button onClick={mintToken}>mintToken</button><br />
                {wallet.publicKey ? `Wallet is connected: ${wallet.publicKey?.toBase58()}` : `No wallet connected.`}
            </h1>
        </div>
    );
};


// Run the mint function

