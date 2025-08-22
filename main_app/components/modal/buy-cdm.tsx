"use client";

import { useState } from "react";
import {
  X,
  Copy,
  TriangleAlert,
  CreditCard,
  Clock,
  Upload,
  FileText,
  File,
  Check,
  CheckCheck,
  CircleQuestionMark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BuyCDMModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  usdtAmount: string;
}

export default function BuyCDMModal({
  isOpen,
  onClose,
  amount,
  usdtAmount,
}: BuyCDMModalProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [isWaitingConfirmation, setIsWaitingConfirmation] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branchName, setBranchName] = useState("");

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("Adminftrs@okaxis");
  };

  const handlePaymentConfirm = () => {
    setIsWaitingConfirmation(true);

    // Simulate waiting for confirmation
    setTimeout(() => {
      setIsPaid(true);
    }, 3000); // Wait 3 seconds before showing confirmation
  };

  const handleUploadDetails = () => {
    setIsUploadComplete(true);
    console.log("Upload Full Payment Details clicked");
  };

  const handleCoinReceived = () => {
    setIsOrderComplete(true);
    console.log("Coin Received on Wallet clicked");
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
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
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
                  <div className="bg-[#1D1C1C] text-black px-2.5 py-1.5 rounded text-sm font-medium flex items-center space-x-2">
                    <img src="/bank.svg" alt="" className="w-4 h-4" />
                    <span className="text-white">CDM</span>
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
                      Please pay Fixed charge of
                      <br />
                      500 ₹ to this UPI ID
                    </div>
                    <div className="text-[#26AF6C] text-xs flex items-center justify-center mb-4">
                      <TriangleAlert className="w-3 h-3 mr-1" />
                      Pay only through registered UPI
                    </div>
                  </div>
                )}

                {/* UPI ID Section - Always visible */}
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

                {/* Account Details Section - Show when waiting for confirmation */}
                {(isWaitingConfirmation || isPaid) && (
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-[#1a1a1a] rounded-xl p-4 md:p-6 mx-auto max-w-2xl">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white text-lg md:text-xl font-semibold">
                          Admin bank Details
                        </h3>
                        <button className="text-gray-400 hover:text-white">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Account Number */}
                        <div>
                          <label className="flex items-center text-white text-sm mb-2">
                            <FileText className="w-4 h-4 mr-2" />
                            Your account number
                          </label>
                          <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Add your Account Number"
                            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        {/* IFSC Code */}
                        <div>
                          <label className="flex items-center text-white text-sm mb-2">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            IFSC CODE
                          </label>
                          <input
                            type="text"
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value)}
                            placeholder="ICICI000234"
                            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        {/* Confirm Account Number */}
                        <div>
                          <label className="flex items-center text-white text-sm mb-2">
                            <FileText className="w-4 h-4 mr-2" />
                            Confirm Your account Number
                          </label>
                          <input
                            type="text"
                            value={confirmAccountNumber}
                            onChange={(e) =>
                              setConfirmAccountNumber(e.target.value)
                            }
                            placeholder="type your Account number again"
                            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        {/* Branch Name */}
                        <div>
                          <label className="flex items-center text-white text-sm mb-2">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            Your branch Name
                          </label>
                          <input
                            type="text"
                            value={branchName}
                            onChange={(e) => setBranchName(e.target.value)}
                            placeholder="Add your Branch Name"
                            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Upload Receipt Section - Hide when upload is complete */}
                    {!isUploadComplete && (
                      <div className="flex items-center justify-center mt-4 px-4">
                        <div className="flex max-w-xs rounded-sm items-center justify-center px-4 py-2 border border-[#2B2B2B]">
                          <Upload className="w-5 h-5 mr-2 text-white" />
                          <span className="text-white text-base md:text-lg font-medium">
                            Please upload Your Receipt
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Progress Bar - Centered */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-60 md:w-80 bg-gray-700 rounded-full h-2 mb-2">
                    <div className="bg-[#622DBF] h-2 rounded-full w-3/4"></div>
                  </div>
                  <div className="text-white text-sm font-medium">
                    14 : 34 Left
                  </div>
                </div>

                {/* Action Button - Always Purple */}
                <div className="px-4 md:px-0">
                  <button
                    onClick={
                      isOrderComplete
                        ? undefined
                        : isUploadComplete
                        ? handleCoinReceived
                        : isWaitingConfirmation || isPaid
                        ? handleUploadDetails
                        : handlePaymentConfirm
                    }
                    disabled={isOrderComplete}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all bg-[#622DBF] ${
                      isOrderComplete
                        ? "cursor-not-allowed opacity-80"
                        : "hover:bg-purple-700"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {isOrderComplete ? (
                        <>
                          <CheckCheck className="w-5 h-5" />
                          <span>Order Complete</span>
                        </>
                      ) : isUploadComplete ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Coin Received on Wallet</span>
                        </>
                      ) : isWaitingConfirmation || isPaid ? (
                        <>
                          <File className="w-5 h-5" />
                          <span>Upload Full Payment Details</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>I Paid 500 ₹ To Admin</span>
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
