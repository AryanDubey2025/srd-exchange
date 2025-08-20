'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnectWallet = () => {
    setIsConnected(!isConnected)
  }

  return (
    <motion.nav 
      className="w-full bg-black text-white px-8 py-3 border-b border-gray-800"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo Section - Far Left */}
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/logo.svg"
              alt="SRD Exchange Logo"
              width={44}
              height={44}
              className="w-10 h-10 object-contain"
            />
          </motion.div>
          <motion.span 
            className="pt-4 text-2xl tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            SRD Exchange
          </motion.span>
        </motion.div>

        {/* Right Section - Far Right */}
        <motion.div 
          className="flex items-center space-x-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {['Futures Trading', 'Why us', 'FAQ', 'Contact us'].map((link, index) => (
              <motion.a 
                key={link}
                href="#" 
                className="text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-200 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          {/* Connect Wallet & Social Section */}
          <div className="flex items-center space-x-4">
            
            <motion.button
              onClick={handleConnectWallet}
              className="bg-[#622DBF] text-white px-4 py-3 rounded-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 20px rgba(98, 45, 191, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm tracking-wide">
                {isConnected ? 'WALLET CONNECTED' : 'CONNECT WALLET'}
              </span>
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.button>

            {/* Social Icons */}
            <motion.div 
              className="flex pl-10 items-center space-x-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Twitter/X Icon */}
              <motion.a 
                href="#" 
                className="w-9 h-9 flex items-center justify-center transition-all duration-200 hover:scale-110"
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 360,
                  backgroundColor: "rgba(98, 45, 191, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                <svg 
                  className="w-6 h-6 fill-current" 
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </motion.a>

              {/* Telegram Icon */}
              <motion.a 
                href="#" 
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                whileHover={{ 
                  scale: 1.2, 
                  rotate: -360,
                  backgroundColor: "rgba(98, 45, 191, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.img 
                  src="/telegram.svg" 
                  alt=""
                  whileHover={{ scale: 1.1 }}
                />
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      </div>
    </motion.nav>
  )
}