'use client'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import WalletConnect from '@/components/WalletConnect'

export default function AdminSignup() {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdminSignup = async () => {
    if (!address) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = '/admin'
        }, 2000)
      } else {
        setError(data.error || 'Failed to register admin')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600">Admin Registered Successfully!</h1>
          <p className="text-gray-600 mt-2">Redirecting to admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Registration</h1>
        
        <WalletConnect />
        
        {isConnected && (
          <button
            onClick={handleAdminSignup}
            disabled={loading}
            className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register as Admin'}
          </button>
        )}
        
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}
