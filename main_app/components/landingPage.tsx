"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Two Purple Background Elements - One left, one right */}
      <motion.div 
        className="absolute top-1/2 left-5/12 transform -translate-y-1/2 -translate-x-102 w-148 h-148 bg-purple-600/20 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute top-1/2 left-5/12 transform -translate-y-1/2 translate-x-0 w-148 h-148 bg-purple-700/30 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
      />
     
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-4">
        {/* Main Heading */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl md:text-4xl lg:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Unlock India's Easiest
          </motion.h1>
          <motion.div 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.span 
              className="text-[#187C58]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              USDT
            </motion.span>
            <span className="text-white"> - </span>
            <motion.span 
              className="text-lime-400"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              INR
            </motion.span>
            <span className="text-white"> Trading.</span>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Trade USDT easily in India. Use UPI and Cash Deposit
            <br />
            with our secure P2P platform.
          </motion.p>
        </motion.div>

        {/* Icons and Central SVG Container */}
        <div className="relative w-full max-w-3xl mx-auto mb-12">
          {/* Top Left Icon */}
          <motion.div 
            className="absolute top-8 left-20 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <motion.img 
              src="/meta-mask.svg" 
              alt="meta-mask"
              animate={floatingAnimation}
            />
          </motion.div>

          {/* Top Right Icon */}
          <motion.div 
            className="absolute top-8 right-20 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.4 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <motion.img 
              src="/google.svg" 
              alt=""
              animate={{
                ...floatingAnimation,
                transition: { ...floatingAnimation.transition, delay: 0.5 }
              }}
            />
          </motion.div>

          {/* Middle Left Icon */}
          <motion.div 
            className="absolute top-1/2 left-8 transform -translate-y-1/2 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.6 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <motion.img 
              src="/wallet.svg" 
              alt=""
              animate={{
                ...floatingAnimation,
                transition: { ...floatingAnimation.transition, delay: 1 }
              }}
            />
          </motion.div>

          {/* Middle Right Icon */}
          <motion.div 
            className="absolute top-1/2 right-8 transform -translate-y-1/2 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.8 }}
            whileHover={{ scale: 1.1, rotate: -10 }}
          >
            <motion.img 
              src="/bank.svg" 
              alt=""
              animate={{
                ...floatingAnimation,
                transition: { ...floatingAnimation.transition, delay: 1.5 }
              }}
            />
          </motion.div>

          {/* Bottom Left Icon */}
          <motion.div 
            className="absolute bottom-8 left-20 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 2 }}
            whileHover={{ scale: 1.1, rotate: 15 }}
          >
            <motion.img 
              src="/bsc-wallet.svg" 
              alt=""
              animate={{
                ...floatingAnimation,
                transition: { ...floatingAnimation.transition, delay: 2 }
              }}
            />
          </motion.div>

          {/* Bottom Right Icon */}
          <motion.div 
            className="absolute bottom-8 right-20 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 2.2 }}
            whileHover={{ scale: 1.1, rotate: -15 }}
          >
            <motion.img 
              src="/phone-pay.svg" 
              alt=""
              animate={{
                ...floatingAnimation,
                transition: { ...floatingAnimation.transition, delay: 2.5 }
              }}
            />
          </motion.div>

          {/* Center Image */}
          <motion.div 
            className="flex justify-center items-center h-96"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.div 
              className="w-96 h-96 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img 
                src="/hero-landing.svg" 
                alt="" 
                className="w-full h-full object-contain"
                animate={{
                  y: [-5, 5, -5],
                  rotate: [-2, 2, -2]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Trade Now Button */}
        <motion.button
          onClick={() => setModalOpen(true)}
          className="bg-[#622DBF] text-white text-xl font-semibold px-12 py-4 rounded-sm transition-all duration-200 flex items-center space-x-3 shadow-xl hover:shadow-purple-500/25 transform hover:scale-105"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.4 }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 20px 40px rgba(98, 45, 191, 0.4)" 
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Trade Now !</span>
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <path
              d="M7 7H17V17"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 17L17 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.button>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="bg-white rounded-lg p-8 max-w-md w-full mx-auto"
                initial={{ scale: 0.7, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0, y: 50 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <motion.h2 
                    className="text-2xl font-bold text-gray-900"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Get Started
                  </motion.h2>
                  <motion.button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>
                <motion.p 
                  className="text-gray-600 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Connect your wallet to start trading USDT-INR
                </motion.p>
                <motion.button
                  onClick={() => setModalOpen(false)}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Connect Wallet
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
