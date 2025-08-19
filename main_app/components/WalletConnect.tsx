'use client'
import { useConnect, useDisconnect, useAccount } from 'wagmi'

export default function WalletConnect() {
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()

  if (isConnected) {
    return (
      <div className="bg-green-100 p-4 rounded-lg">
        <p className="text-green-800 font-medium">Connected</p>
        <p className="text-sm text-gray-600">{address}</p>
        <button 
          onClick={() => disconnect()}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium">Connect Your Wallet</h3>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={status === 'pending'}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {connector.name}
        </button>
      ))}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  )
}
