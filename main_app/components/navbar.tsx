'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnectWallet = () => {
    // TODO: Implement wallet connection logic
    setIsConnected(!isConnected)
  }

  return (
    <nav className="w-full bg-black text-white px-8 py-3 border-b border-gray-800">
      <div className="flex items-center justify-between w-full">
        {/* Logo Section - Far Left */}
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.svg"
            alt="SRD Exchange Logo"
            width={44}
            height={44}
            className="w-10 h-10 object-contain"
          />
          <span className=" pt-4 text-2xl tracking-tight">SRD Exchange</span>
        </div>

        {/* Right Section - Far Right */}
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <a 
              href="#" 
              className="text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group"
            >
              Futures Trading
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              href="#" 
              className="text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group"
            >
              Why us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              href="#" 
              className="text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              href="#" 
              className="text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group"
            >
              Contact us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
          </div>

          {/* Connect Wallet & Social Section */}
          <div className="flex items-center space-x-4">
            
            <button
              onClick={handleConnectWallet}
              className=" bg-[#622DBF] text-white px-4 py-3 rounded-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25"
            >
              <span className="text-sm tracking-wide">
                {isConnected ? 'WALLET CONNECTED' : 'CONNECT WALLET'}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {/* Social Icons */}
            <div className="flex pl-10 items-center space-x-2">
              {/* Twitter/X Icon */}
              <a 
                href="#" 
                className="w-9 h-9 flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg 
                  className="w-6 h-6 fill-current" 
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Telegram Icon */}
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
               <img src="/telegram.svg" alt="" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  )
}