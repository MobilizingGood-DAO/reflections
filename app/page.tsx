"use client";
import { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x531dBA50F8198B1Cf15201c89DB7ed1E3C3F61a2';
const CHAIN_ID = 48169;
const RPC_URL = 'https://subnets.avax.network/goodtest/testnet/rpc';
const NFT_STORAGE_API_KEY = 'b2b22ff0.916669fd4e6f42d5aab07621c9137b54';

export default function ReflectionJournal() {
  const [reflection, setReflection] = useState('');
  const [status, setStatus] = useState('');

  const handleMint = async () => {
    try {
      if (!window.ethereum) return alert('Please install MetaMask');

      setStatus('Connecting wallet...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const { chainId } = await provider.getNetwork();
      if (chainId !== CHAIN_ID) {
        return alert(`Please switch to GOOD L1 Testnet (Chain ID: ${CHAIN_ID})`);
      }

      // Upload to IPFS via nft.storage
      setStatus('Uploading reflection to IPFS...');
      const metadata = {
        name: 'Self-Reflection NFT',
        description: reflection,
        image: 'https://bafybeibmqnx2q2d2xyv7gvf4lm2jh5ljxd3akz3xphcy3bw5zluqjhxwpq.ipfs.nftstorage.link/care.png' // placeholder image
      };

      const res = await fetch("https://api.nft.storage/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NFT_STORAGE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(metadata)
      });

      const data = await res.json();
      const tokenURI = `https://${data.value.cid}.ipfs.nftstorage.link/`;

      // Call mint on smart contract
      const abi = ["function mint(address to, string memory tokenURI) external"];
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const userAddress = await signer.getAddress();

      setStatus('Minting your reflection...');
      const tx = await contract.mint(userAddress, tokenURI);
      await tx.wait();

      setStatus('✅ Reflection NFT minted!');
      setReflection('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error minting NFT. Check console.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 20 }}>
      <h2>🪞 Reflection Journal</h2>
      <textarea
        placeholder="What did you reflect on today?"
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        style={{ width: '100%', padding: 10, marginTop: 10, marginBottom: 10 }}
        rows={4}
      />
      <button onClick={handleMint} disabled={!reflection}>
        Mint Reflection NFT
      </button>
      <p>{status}</p>
    </div>
  );
}
