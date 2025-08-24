'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'


export default function Navbar() {
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isConnected, address } = useAccount()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleConnectWallet = () => {
    if (!isConnected) {
      setShowWalletModal(true)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navLinks = ['Futures Trading', 'Why us', 'FAQ', 'Contact us']

  return (
    <>
      <motion.nav 
        className="w-full bg-black text-white px-4 sm:px-8 py-3 border-b border-gray-800 relative z-50 font-montserrat"
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
            <div>
              <Image
                src="/logo.svg"
                alt="SRD Exchange Logo"
                width={44}
                height={44}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <motion.span 
              className="pt-4 text-lg sm:text-2xl font-bold tracking-tight font-montserrat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              SRD Exchange
            </motion.span>
          </motion.div>

          {/* Desktop Navigation - Hidden on Mobile */}
          <motion.div 
            className="hidden lg:flex items-center space-x-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <motion.a 
                  key={link}
                  href="#" 
                  className="text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group font-montserrat"
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
                className="bg-[#622DBF] text-white px-4 py-3 rounded-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25 font-montserrat"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 20px rgba(98, 45, 191, 0.3)" 
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm tracking-wide font-medium">
                  {isConnected 
                    ? `${address?.slice(0, 6)}...${address?.slice(-4)}` 
                    : 'CONNECT WALLET'
                  }
                </span>
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={!isMobile ? { x: [0, 3, 0] } : {}}
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
                  whileHover={!isMobile ? { 
                    scale: 1.2, 
                    rotate: 360,
                    backgroundColor: "rgba(98, 45, 191, 0.2)"
                  } : { scale: 1.1 }}
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
                  whileHover={!isMobile ? { 
                    scale: 1.2, 
                    rotate: -360,
                    backgroundColor: "rgba(98, 45, 191, 0.2)"
                  } : { scale: 1.1 }}
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

          {/* Mobile Right Section - Social Icons + Hamburger */}
          <motion.div 
            className="flex lg:hidden items-center space-x-3"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Mobile Social Icons */}
            <div className="flex items-center space-x-2">
              {/* Twitter/X Icon */}
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center transition-all duration-200"
              >
                <svg 
                  className="w-5 h-5 fill-current" 
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Telegram Icon */}
              <a 
                href="#" 
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              >
                <img 
                  src="/telegram.svg"
                  alt=""
                  className="w-5 h-5"
                />
              </a>
            </div>

            {/* Hamburger Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-black border-l border-gray-800 z-50 lg:hidden font-montserrat"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white font-montserrat">Menu</h2>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 p-6">
                  <nav className="space-y-4">
                    {navLinks.map((link, index) => (
                      <motion.a
                        key={link}
                        href="#"
                        className="block text-lg font-montserrat font-medium text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-montserrat"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link}
                      </motion.a>
                    ))}
                  </nav>
                </div>

                {/* Connect Wallet Button */}
                <div className="p-6 border-t border-gray-800">
                  <motion.button
                    onClick={() => {
                      handleConnectWallet()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full bg-[#622DBF] text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg font-montserrat"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="text-base tracking-wide font-monserrat">
                      {isConnected 
                        ? `${address?.slice(0, 6)}...${address?.slice(-4)}` 
                        : 'CONNECT WALLET'
                      }
                    </span>
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

     
    </>
  )
}