"use client";
import { useState } from "react";

export default function LandingPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Two Purple Background Elements - One left, one right */}
      <div className="absolute top-1/2 left-5/12 transform -translate-y-1/2 -translate-x-102 w-148 h-148 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-5/12 transform -translate-y-1/2 translate-x-0 w-148 h-148 bg-purple-700/30 rounded-full blur-3xl"></div>
     
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-4">
        {/* Main Heading */}
        <div className="text-center max-w-4xl mx-auto mb-6">
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold  leading-tight">
            Unlock India's Easiest
          </h1>
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold  leading-tight">
            <span className="text-[#187C58]">USDT</span>
            <span className="text-white"> - </span>
            <span className="text-lime-400">INR</span>
            <span className="text-white"> Trading.</span>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Trade USDT easily in India. Use UPI and Cash Deposit
            <br />
            with our secure P2P platform.
          </p>
        </div>

        {/* Icons and Central SVG Container */}
        <div className="relative w-full max-w-3xl mx-auto mb-12">
          {/* Top Left Icon Placeholder */}
          <div className="absolute top-8 left-20 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
            <img src="/meta-mask.svg" alt="meta-mask" />
          </div>

          {/* Top Right Icon Placeholder */}
          <div className="absolute top-8 right-20 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
            <img src="/google.svg" alt="" />
          </div>

          {/* Middle Left Icon Placeholder */}
          <div className="absolute top-1/2 left-8 transform -translate-y-1/2 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <img src="/wallet.svg" alt="" />
          </div>

          {/* Middle Right Icon Placeholder */}
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <img src="/bank.svg" alt="" />
          </div>

          {/* Bottom Left Icon Placeholder */}
          <div className="absolute bottom-8 left-20 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
            <img src="/bsc-wallet.svg" alt="" />
          </div>

          {/* Bottom Right Icon Placeholder */}
          <div className="absolute bottom-8 right-20 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <img src="/phone-pay.svg" alt="" />
          </div>

          {/* Center Image - Increased size */}
          <div className="flex justify-center items-center h-96">
            <div className="w-96 h-96 flex items-center justify-center">
              <img src="/hero-landing.svg" alt="" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Trade Now Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#622DBF] text-white text-xl font-semibold px-12 py-4 rounded-sm transition-all duration-200 flex items-center space-x-3 shadow-xl hover:shadow-purple-500/25 transform hover:scale-105"
        >
          <span>Trade Now !</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
          </svg>
        </button>

        {/* Modal Placeholder */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Get Started
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
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
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Connect your wallet to start trading USDT-INR
              </p>
              <button
                onClick={() => setModalOpen(false)}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
