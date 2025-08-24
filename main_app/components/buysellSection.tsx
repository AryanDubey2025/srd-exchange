'use client'

import { Copy, User } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BuyCDMModal from './modal/buy-cdm'
import BuyUPIModal from './modal/buy-upi'
import SellUPIModal from './modal/sell-upi'
import SellCDMModal from './modal/sell-cdm'

export default function BuySellSection() {
  const [activeTab, setActiveTab] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [showBuyCDMModal, setShowBuyCDMModal] = useState(false)
  const [showBuyUPIModal, setShowBuyUPIModal] = useState(false)
  const [showSellUPIModal, setShowSellUPIModal] = useState(false)
  const [showSellCDMModal, setShowSellCDMModal] = useState(false)

  // Buy and Sell prices from the display
  const buyPrice = 85.6
  const sellPrice = 85.6

  //  USDT amount based on rupee input (for buy)
  const calculateUSDT = (rupeeAmount: string) => {
    const numericAmount = parseFloat(rupeeAmount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return '0'
    }
    const usdtAmount = numericAmount / buyPrice
    return usdtAmount.toFixed(2)
  }

  //  Rupee amount based on USDT input (for sell)
  const calculateRupee = (usdtAmount: string) => {
    const numericAmount = parseFloat(usdtAmount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return '0'
    }
    const rupeeAmount = numericAmount * sellPrice
    return rupeeAmount.toFixed(2)
  }

  const usdtAmount = calculateUSDT(amount)
  const rupeeAmount = calculateRupee(amount)

  // Get payment method display name
  const getPaymentMethodName = () => {
    switch(paymentMethod) {
      case 'upi': return 'UPI'
      case 'cdm': return 'CDM'
      default: return ''
    }
  }

  // Reset payment method when switching tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setPaymentMethod('')
    setAmount('')
  }

  // Handle buy/sell button click
  const handleBuySellClick = () => {
    if (activeTab === 'buy' && paymentMethod === 'cdm') {
      setShowBuyCDMModal(true)
    } else if (activeTab === 'buy' && paymentMethod === 'upi') {
      setShowBuyUPIModal(true)
    } else if (activeTab === 'sell' && paymentMethod === 'upi') {
      setShowSellUPIModal(true)
    } else if (activeTab === 'sell' && paymentMethod === 'cdm') {
      setShowSellCDMModal(true)
    } else {
      // Handle other payment methods
      console.log(`${activeTab} with ${paymentMethod}`)
    }
  }

  return (
    <>
      <div className="bg-black text-white h-full flex items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="w-full space-y-4">
          {/* Wallet Balance Card */}
          <motion.div 
            className="bg-[#101010] max-w-md border border-[#3E3E3E] rounded-md p-3 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="flex justify-center items-center space-x-2 sm:space-x-3 mb-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5"/>
                </div>
                <span className="text-xs sm:text-sm text-white font-medium truncate">0xA78B65-E91b2a2</span>
                <Copy className='w-3 h-3 sm:w-4 sm:h-4'/>
              </div>
              <div className="text-center">
                <div className="text-xs text-white mb-1">Available Balance</div>
                <div className="text-lg sm:text-xl font-bold text-white">20 USDT</div>
                <div className="text-xs text-gray-400 mt-1 flex items-center justify-center space-x-1">
                  <span>≈</span>
                  <span>₹{(20 * buyPrice).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Price Display - Centered */}
          <motion.div 
            className="flex justify-center max-w-md space-x-3 sm:space-x-6 mx-auto mb-6 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="border border-[#3E3E3E] rounded-lg p-3 sm:p-4 min-w-[100px] sm:min-w-[120px]">
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <img src="/buy.svg" alt="" className='w-4 h-4 sm:w-5 sm:h-5'/>
                <span className="text-xs sm:text-sm text-white">Buy Price</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-center">85.6 ₹</div>
            </div>
            <div className="border border-[#3E3E3E] rounded-md py-3 sm:py-4 px-2 min-w-[100px] sm:min-w-[120px]">
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <img src="/sell.svg" alt="" className='w-4 h-4 sm:w-5 sm:h-5'/>
                <span className="text-xs sm:text-sm text-white">Sell Price</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-center">85.6 ₹</div>
            </div>
          </motion.div>

          {/* Buy/Sell Tabs */}
          <motion.div 
            className="flex space-x-3 sm:space-x-6 max-w-lg mx-auto mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.button
              onClick={() => handleTabChange('buy')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 sm:py-4 px-6 sm:px-12 rounded-md font-semibold text-base sm:text-lg transition-all ${
                activeTab === 'buy'
                  ? 'bg-[#622DBF] text-white shadow-lg shadow-purple-600/25'
                  : 'bg-[#101010] text-white border border-[#3E3E3E] hover:bg-gray-700/50'
              }`}
            >
              Buy
            </motion.button>
            <motion.button
              onClick={() => handleTabChange('sell')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 sm:py-4 px-6 sm:px-12 rounded-md font-semibold text-base sm:text-lg transition-all ${
                activeTab === 'sell' 
                  ? 'bg-[#622DBF] text-white shadow-lg shadow-purple-600/25' 
                  : 'bg-[#101010] text-white border border-[#3E3E3E] hover:bg-gray-700/50'
              }`}>
              Sell
            </motion.button>
          </motion.div>

          {/* Payment Method Selection */}
          <AnimatePresence>
            {activeTab && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900/30 border border-[#3E3E3E] rounded-md p-4 sm:p-5 mb-6 sm:mb-8 overflow-hidden"
              >
                <h3 className="text-lg sm:text-xl mb-2 text-white">Select how you'd like to {activeTab === 'buy' ? 'pay' : 'receive payment'}</h3>
                <div className="space-y-3 sm:space-y-4">
                  <motion.label 
                    className="flex items-center space-x-3 sm:space-x-4 cursor-pointer group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all ${
                        paymentMethod === 'upi' 
                          ? 'bg-[#622DBF] border-[#622DBF]' 
                          : 'bg-[#1E1C1C] border-[#3E3E3E]'
                      }`}
                      onClick={() => setPaymentMethod('upi')}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence>
                        {paymentMethod === 'upi' && (
                          <motion.svg 
                            className="w-3 h-3 text-white" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <img src="/phonepay-gpay.svg" alt="" className="w-6 h-6" />
                      <span className="text-sm sm:text-base font-medium group-hover:text-white transition-colors">
                        {activeTab === 'buy' ? 'Pay with UPI' : 'Receive via UPI'}
                      </span>
                    </div>
                  </motion.label>
                  <motion.label 
                    className="flex items-center space-x-3 sm:space-x-4 cursor-pointer group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all ${
                        paymentMethod === 'cdm' 
                          ? 'bg-[#622DBF] border-[#622DBF]' 
                          : 'bg-[#1E1C1C] border-[#3E3E3E]'
                      }`}
                      onClick={() => setPaymentMethod('cdm')}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence>
                        {paymentMethod === 'cdm' && (
                          <motion.svg 
                            className="w-3 h-3 text-white" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <img src="/bank.svg" alt="" className='w-5 h-5 sm:w-6 sm:h-6' />
                      <span className="text-sm sm:text-base font-medium group-hover:text-white transition-colors">
                        {activeTab === 'buy' ? 'Cash Deposit (CDM)' : 'Cash Withdrawal (CDM)'}
                      </span>
                    </div>
                  </motion.label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Amount Input Section */}
          <AnimatePresence>
            {activeTab && paymentMethod && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#101010] border border-[#3E3E3E] rounded-md p-4 sm:p-5"
              >
                <div className="flex justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-5">
                  <img src={paymentMethod === 'upi' ? "/phonepay-gpay.svg" : "/bank.svg"} alt="" className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-md text-gray-300 text-center">
                    You are {activeTab === 'buy' ? 'buying' : 'selling'} via {getPaymentMethodName()}
                  </span>
                </div>
                
                <div className="relative mb-4 sm:mb-6 flex justify-center">
                  <span className="absolute left-3 sm:left-65 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl sm:text-3xl">
                    {activeTab === 'buy' ? '₹' : activeTab === 'sell' ? '$' : '₹'}
                  </span>
                  <motion.input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-[#1E1C1C] border border-gray-600/50 rounded-xl py-4 sm:py-5 pl-10 sm:pl-12 pr-4 text-xl sm:text-2xl font-medium focus:outline-none focus:border-[#622DBF] focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500 w-full max-w-xs"
                    placeholder="0"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <motion.svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none" 
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: amount ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </motion.svg>
                </div>

                <motion.div 
                  className="text-center"
                  key={activeTab === 'buy' ? usdtAmount : rupeeAmount}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-xl sm:text-2xl font-bold mb-2 text-white">
                    {activeTab === 'buy' ? `${usdtAmount} USDT` : `₹${rupeeAmount}`}
                  </div>
                  <div className="text-sm text-white">
                    {activeTab === 'buy' 
                      ? 'will be credited to your account'
                      : 'will be transferred to your account'
                    }
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <AnimatePresence>
            {activeTab && paymentMethod && (
              <motion.button 
                onClick={handleBuySellClick}
                className="w-full bg-[#622DBF] hover:bg-purple-700 text-white py-4 sm:py-5 px-6 rounded-xl font-bold text-lg sm:text-xl transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'buy' ? 'Buy' : 'Sell'}
              </motion.button>
            )}
          </AnimatePresence>

          {/* How to buy/sell link */}
          <AnimatePresence>
            {activeTab && (
              <motion.div 
                className="text-center pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button 
                  className="flex items-center space-x-2 text-white hover:text-white transition-colors mx-auto group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.svg 
                    className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 15 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </motion.svg>
                  <span className="font-medium text-sm sm:text-base">How to {activeTab}?</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CDM Modal */}
      <BuyCDMModal 
        isOpen={showBuyCDMModal}
        onClose={() => setShowBuyCDMModal(false)}
        amount={amount}
        usdtAmount={usdtAmount}
      />

      {/* UPI Modal */}
      <BuyUPIModal 
        isOpen={showBuyUPIModal}
        onClose={() => setShowBuyUPIModal(false)}
        amount={amount}
        usdtAmount={usdtAmount}
      />

      {/* Sell UPI Modal */}
      <SellUPIModal 
        isOpen={showSellUPIModal}
        onClose={() => setShowSellUPIModal(false)}
        usdtAmount={amount}
        amount={rupeeAmount}
      />

      {/* Sell CDM Modal */}
      <SellCDMModal 
        isOpen={showSellCDMModal}
        onClose={() => setShowSellCDMModal(false)}
        usdtAmount={amount}
        amount={rupeeAmount}
      />
    </>
  )
}