"use client";

import { useState } from "react";
import {
  X,
  Copy,
  TriangleAlert,
  CreditCard,
  Clock,
  Check,
  CheckCheck,
  CircleQuestionMark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BuyUPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  usdtAmount: string;
}

export default function BuyUPIModal({
  isOpen,
  onClose,
  amount,
  usdtAmount,
}: BuyUPIModalProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [isWaitingConfirmation, setIsWaitingConfirmation] = useState(false);
  const [isCoinReceived, setIsCoinReceived] = useState(false);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("Adminftrs@okaxis");
  };

  const handlePaymentConfirm = () => {
    setIsWaitingConfirmation(true);
    // Remove the automatic timeout
  };

  const handleWaitingConfirmation = () => {
    setIsPaid(true);
    setIsWaitingConfirmation(false);
    console.log("Waiting confirmation clicked - showing coin received");
  };

  const handleCoinReceived = () => {
    setIsCoinReceived(true);
    console.log("Coin Received in Wallet clicked");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 p-4 md:p-4 pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#111010] rounded-t-xl md:rounded-xl max-w-4xl w-full relative overflow-hidden max-h-[90vh] md:max-h-[90vh]"
            initial={{
              scale:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? 1
                  : 0.9,
              opacity:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? 1
                  : 0,
              y:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? "100%"
                  : 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? 1
                  : 0.9,
              opacity:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? 1
                  : 0,
              y:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? "100%"
                  : 0,
            }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-[#2F2F2F]">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  isCoinReceived 
                    ? 'bg-gray-400' 
                    : isPaid 
                    ? 'bg-green-400' 
                    : 'bg-yellow-400'
                }`}></div>
                <span className="text-white font-medium">Order 14</span>
              </div>
              
              {/* Desktop - Centered "How to buy" */}
              <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-1 justify-center items-center text-white text-sm">
                <CircleQuestionMark className="w-5 h-5" />
                <span>How to buy?</span>
              </div>
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="text-white hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Main Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] md:max-h-[calc(90vh-80px)]">
              <div className="p-4 text-center">
              {isPaid && (
                    <motion.div
                      className="text-[#26AF6C] text-sm font-medium mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Admin paid you {usdtAmount} USDT
                    </motion.div>
                  )}
                {/* Amount Display */}
                <div className="mb-6">
                  <div className="text-4xl md:text-4xl font-bold text-white mb-2">
                    {amount}₹
                  </div>
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </div>
                  <div className="text-xs text-white mt-2 mb-4">
                    {usdtAmount} USDT
                  </div>
                  
    
                 
                </div>

                {/* Payment Method Badge */}
                <div className="flex items-center justify-center space-x-4 md:space-x-10 mb-6 flex-wrap gap-2">
                  <div className="bg-[#1D1C1C] text-black px-2 py-1 rounded text-sm font-medium flex items-center space-x-2">
                    <img src="/phonepay-gpay.svg" alt="" className="w-5 h-5"/>
                    <span className="text-white">UPI</span>
                  </div>
                  <span className="text-white px-2 py-1 bg-[#1D1C1C] rounded-md text-sm">
                    Buy Order
                  </span>
                  <span className="text-white px-2 py-1 bg-[#1D1C1C] rounded-md text-sm">
                    Today 11:40 PM
                  </span>
                </div>

                {/* Payment Instructions - Hide when waiting for confirmation */}
                {!isWaitingConfirmation && !isPaid && (
                  <div className="mb-8">
                    <div className="text-white mb-1">
                      Please pay {amount}₹ to this UPI ID
                    </div>
                    <div className="text-[#26AF6C] text-xs flex items-center justify-center mb-4">
                      <TriangleAlert className="w-3 h-3 mr-1" />
                      Pay only through registered UPI
                    </div>
                  </div>
                )}

                {/* UPI ID Section */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center justify-between bg-[#2a2a2a] rounded-lg px-4 py-3 min-w-[280px] md:min-w-[325px] max-w-md w-full mx-4">
                    <span className="text-white font-medium text-lg md:text-lg">
                      Adminftrs@okaxis
                    </span>
                    <button
                      onClick={handleCopyUPI}
                      className="text-gray-400 hover:text-white transition-colors ml-4"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar - Centered */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-60 md:w-80 bg-gray-700 rounded-full h-2 mb-2">
                    <div className="bg-[#622DBF] h-2 rounded-full w-3/4"></div>
                  </div>
                  <div className="text-white text-sm font-medium">
                    14 : 34 Left
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-4 md:px-0">
                  <button
                    onClick={
                      isCoinReceived
                        ? undefined
                        : isPaid
                        ? handleCoinReceived
                        : isWaitingConfirmation
                        ? handleWaitingConfirmation
                        : handlePaymentConfirm
                    }
                    disabled={isCoinReceived}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all bg-[#622DBF] ${
                      isCoinReceived
                        ? "cursor-not-allowed opacity-80"
                        : "hover:bg-purple-700"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {isCoinReceived ? (
                        <>
                          <CheckCheck className="w-5 h-5" />
                          <span>Order Complete</span>
                        </>
                      ) : isPaid ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Coin Received in Wallet</span>
                        </>
                      ) : isWaitingConfirmation ? (
                        <>
                          <Clock className="w-5 h-5 animate-spin" />
                          <span>Waiting for confirmation</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>I Paid {amount}₹ To Admin</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}