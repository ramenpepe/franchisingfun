import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Buffer } from 'buffer';
window.Buffer = Buffer;
import {
    Connection,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction,
    signAndSendTransaction,
    sendAndConfirmTransaction,
  } from "@solana/web3.js";

// SPL Token Program ID
const TOKEN_PROGRAM_ID = new PublicKey(
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);
const MINT_SIZE = 82; // Size of the mint account


const TOKEN_INSTRUCTION_INITIALIZE_MINT = 0; // InitializeMint instruction
// Create Initialize Mint Instruction
function createInitializeMintInstructionmanual(mint, decimals, mintAuthority, freezeAuthority = null, programId = TOKEN_PROGRAM_ID) {
    // List of account keys required by the instruction
    const keys = [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];

    
    // Create a buffer for the instruction data (66 bytes for InitializeMint)
    //const data = Buffer.alloc(66);
    const data = Buffer.alloc(132);
    // Instruction index (0 for InitializeMint)
    data[0] = TOKEN_INSTRUCTION_INITIALIZE_MINT;

    // Write decimals (1 byte)
    data[1] = decimals;

    // Write the 32 bytes of mint authority's public key
    mintAuthority.toBuffer().copy(data, 2, 0, 32);

    // Write the freeze authority's public key, or set it to all zeros if it's null
    if (freezeAuthority) {
        data[34] = 1;  // Set a flag to indicate freeze authority is present
        freezeAuthority.toBuffer().copy(data, 35, 0, 32);
    } else {
        data[34] = 0;  // Set a flag indicating no freeze authority
        Buffer.alloc(32).copy(data, 35);  // Fill with zero bytes
    }

    // Create and return the TransactionInstruction object
    return new TransactionInstruction({
        keys,
        programId,
        data,
    });
}

// Create Mint Account Function
async function createMintAccount(payer, decimals, connection) {
    const mintKeypair = Keypair.generate();
    const mintAccountPublicKey = mintKeypair.publicKey;

    try {
        // Calculate minimum balance for rent exemption
        const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
        console.log(`Lamports needed for mint account: ${lamports}`);

        // Create the Initialize Mint Instruction
        const initializeMintInstruction = createInitializeMintInstructionmanual(
            mintAccountPublicKey,
            decimals,
            payer.publicKey,
            payer.publicKey
        );

        // Create the mint account transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: payer.publicKey,
                toPubkey: mintAccountPublicKey,
                space: MINT_SIZE,
                lamports,
            }),
            initializeMintInstruction // Add initialize mint instruction
        );

        console.log('Transaction created:', transaction);
/**
        await sendAndConfirmTransaction(
            connection, 
            transaction, 
            [payer, mintKeypair]  // Signers must include both the payer and mint keypair
        );
 */
        // Send and confirm the transaction

        const signature = await payer.signAndSendTransaction(transaction);

        const latestBlockHash = await connection.getLatestBlockhash();
        const pending = await connection.confirmTransaction({blockhash: latestBlockHash.blockhash,
             lastValidBlockHeight: latestBlockHash.lastValidBlockHeight, signature});
      
        console.log('Transaction confirmation:', pending);    
        
        console.log('Mint account created:', mintAccountPublicKey.toBase58());
 
        
        return mintAccountPublicKey;
    } catch (error) {
        console.error('Error creating mint account:', error);
        throw error; // Optionally rethrow the error for further handling
    }
}


// Create Associated Token Account

const Mint = () => {
    const key = [208,238,27,134,248,90,134,156,227,69,64,79,37,92,148,129,27,21,73,87,66,153,67,9,104,105,235,214,25,100,95,106,35,78,87,12,143,158,80,77,54,6,0,113,89,10,75,37,209,132,219,152,239,28,237,183,83,146,75,32,156,204,164,133];
   // const wallet = Keypair.fromSecretKey(Uint8Array.from(key)); // Use the secret key array

        const wallet = useWallet();
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    async function mintToken() {
       

        try {
            
            const decimals = 9;
            const mint = await createMintAccount(wallet, decimals, connection);

        } catch (error) {
            console.error('Error minting tokens:', error);
        }
    }

    return (
        <div>
            <h1 style={{ color: 'white' }}>
                <button onClick={mintToken}>Mint Token</button><br />
                {wallet.publicKey ? `Wallet is connected: ${wallet.publicKey.toBase58()}` : 'No wallet connected.'}
            </h1>
        </div>
    );
};

export default Mint;
