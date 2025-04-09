// Reflection Journal UI for GOOD L1 Testnet
import { useState } from 'react'
import { ethers } from 'ethers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

const CONTRACT_ADDRESS = '0x531dBA50F8198B1Cf15201c89DB7ed1E3C3F61a2'
const CHAIN_ID = 48169
const RPC_URL = 'https://subnets.avax.network/goodtest/testnet/rpc'

export default function ReflectionJournal() {
  const [reflection, setReflection] = useState('')
  const [status, setStatus] = useState('')

  const handleMint = async () => {
    if (!window.ethereum) return alert('Please install MetaMask')

    setStatus('Connecting...')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()

    const { chainId } = await provider.getNetwork()
    if (chainId !== CHAIN_ID) {
      return alert(`Please switch to GOOD L1 Testnet (Chain ID: ${CHAIN_ID})`)
    }

    // Upload reflection to IPFS via nft.storage
    setStatus('Uploading reflection to IPFS...')
    const metadata = {
      name: 'Self-Reflection NFT',
      description: reflection,
      image: 'https://bafybeibmqnx2q2d2xyv7gvf4lm2jh5ljxd3akz3xphcy3bw5zluqjhxwpq.ipfs.nftstorage.link/care.png' // placeholder image
    }

    const res = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer b2b22ff0.916669fd4e6f42d5aab07621c9137b54`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metadata)
    })
    const data = await res.json()
    const tokenURI = `https://${data.value.cid}.ipfs.nftstorage.link/`

    // Interact with contract
    const abi = [
      'function mint(address to, string memory tokenURI) external'
    ]
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
    const userAddress = await signer.getAddress()

    setStatus('Minting your reflection NFT...')
    const tx = await contract.mint(userAddress, tokenURI)
    await tx.wait()
    setStatus('✅ Reflection NFT minted!')
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="p-4 shadow-xl">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">Mint Your Reflection 🪞</h2>
          <Textarea
            placeholder="What did you reflect on today?"
            rows={4}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleMint} disabled={!reflection}>
            Mint Reflection NFT
          </Button>
          <p className="mt-4 text-sm text-gray-500">{status}</p>
        </CardContent>
      </Card>
    </div>
  )
}
