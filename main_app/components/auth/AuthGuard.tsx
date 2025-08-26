'use client'

import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Wallet, Shield } from 'lucide-react'
import WalletConnectModal from './WalletConnectModal'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function AuthGuard({ 
  children, 
  requireAuth = true,
  redirectTo = '/'
}: AuthGuardProps) {
  const { isConnected, address } = useAccount()
  const router = useRouter()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const verifyUser = async () => {
      if (!requireAuth) {
        setIsVerifying(false)
        setIsAuthorized(true)
        return
      }

      if (!isConnected || !address) {
        setIsVerifying(false)
        setIsAuthorized(false)
        return
      }

      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address }),
        })

        if (res.ok) {
          const { isValid } = await res.json()
          setIsAuthorized(isValid)
        } else {
          setIsAuthorized(false)
        }
      } catch (error) {
        console.error('Verification failed:', error)
        setIsAuthorized(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyUser()
  }, [isConnected, address, requireAuth])

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-[#622DBF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2 font-montserrat">
            Verifying Access...
          </h2>
          <p className="text-gray-400 font-montserrat">
            Please wait while we check your credentials
          </p>
        </motion.div>
      </div>
    )
  }

  // Show auth required screen
  if (requireAuth && (!isConnected || !isAuthorized)) {
    return (
      <>
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <motion.div
            className="text-center max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="w-20 h-20 bg-[#622DBF]/20 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Wallet className="w-10 h-10 text-[#622DBF]" />
            </motion.div>
            
            <motion.h2
              className="text-3xl font-bold text-white mb-4 font-montserrat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Authentication Required
            </motion.h2>
            
            <motion.p
              className="text-gray-400 mb-8 font-montserrat leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              To access the trading dashboard, please connect your wallet and verify your identity.
            </motion.p>
            
            <motion.button
              onClick={() => setShowWalletModal(true)}
              className="bg-[#622DBF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-600/25 font-montserrat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Connect Wallet
            </motion.button>

            <motion.div
              className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium font-montserrat">
                  Secure Connection
                </span>
              </div>
              <p className="text-gray-400 text-sm font-montserrat">
                Your wallet connection is encrypted and secure. We never store your private keys.
              </p>
            </motion.div>
          </motion.div>
        </div>
        
        <WalletConnectModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          onSuccess={() => {
            setShowWalletModal(false)
            setIsAuthorized(true)
          }}
        />
      </>
    )
  }

  return <>{children}</>
}