import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  sendAndConfirmTransaction,
  Transaction,
} from '@solana/web3.js';
const { getKeypairFromEnvironment, getExplorerLink }=require("@solana-developers/helpers");

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export async function createMint(connection, payer, mintAuthority, freezeAuthority, decimals) {
  const mintAccount = new PublicKey(/* Generate a new PublicKey */);
  const lamports = await connection.getMinimumBalanceForRentExemption(82);

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintAccount,
      space: 82,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintAccount,
      decimals,
      mintAuthority,
      freezeAuthority
    )
  );

  await connection.sendTransaction(transaction, [payer]);
  return mintAccount;
}

export async function mintTo(connection, payer, mint, destination, authority, amount) {
  const transaction = new Transaction().add(
    createMintToInstruction(
      mint,
      destination,
      authority,
      amount
    )
  );

  return await connection.sendTransaction(transaction, [payer]);
}

export async function getOrCreateAssociatedTokenAccount(
  connection,
  payer,
  mint,
  owner,
  allowOwnerOffCurve = false
) {
  const associatedToken = await getAssociatedTokenAddress(mint, owner, allowOwnerOffCurve);

  try {
    return await getAccount(connection, associatedToken);
  } catch (error) {
    if (error.name === 'TokenAccountNotFoundError') {
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          payer.publicKey,
          associatedToken,
          owner,
          mint
        )
      );

      await connection.sendTransaction(transaction, [payer]);
      return await getAccount(connection, associatedToken);
    } else {
      throw error;
    }
  }
}

// Helper functions (you'll need to implement these)
function createInitializeMintInstruction(/* ... */) {
  // Implement this function
}

function createMintToInstruction(/* ... */) {
  // Implement this function
}

function getAssociatedTokenAddress(/* ... */) {
  // Implement this function
}

function getAccount(/* ... */) {
  // Implement this function
}

function createAssociatedTokenAccountInstruction(/* ... */) {
  // Implement this function
}


export const addMetadata= async(tokenMintAccount, wallet, connection) =>{
    
 
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
    const { createCreateMetadataAccountV3Instruction }=require("@metaplex-foundation/mpl-token-metadata");

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