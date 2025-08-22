"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("all");

  const ongoingOrders = [
    {
      id: "14",
      type: "buy",
      date: "Today",
      time: "11:00pm",
      status: "Approved",
      statusColor: "text-green-500",
      dotColor: "bg-green-500",
    },
    {
      id: "14",
      type: "buy",
      date: "Today",
      time: "11:00pm",
      status: "Pending",
      statusColor: "text-yellow-500",
      dotColor: "bg-yellow-500",
    },
    {
      id: "14",
      type: "sell",
      date: "Today",
      time: "11:00pm",
      status: "Rejected",
      statusColor: "text-red-500",
      dotColor: "bg-red-500",
    },
    {
      id: "14",
      type: "buy",
      date: "Today",
      time: "11:00pm",
      status: "Verified",
      statusColor: "text-green-500",
      dotColor: "bg-green-500",
    },
    {
      id: "14",
      type: "sell",
      date: "Today",
      time: "11:00pm",
      status: "Verified",
      statusColor: "text-green-500",
      dotColor: "bg-green-500",
    },
  ];

  const completedOrders = [
    {
      id: "14",
      type: "buy",
      date: "Today",
      time: "11:00pm",
      status: "Completed",
      statusColor: "text-gray-400",
      dotColor: "bg-gray-400",
    },
    {
      id: "14",
      type: "sell",
      date: "Today",
      time: "11:00pm",
      status: "Completed",
      statusColor: "text-gray-400",
      dotColor: "bg-gray-400",
    },
    {
      id: "14",
      type: "buy",
      date: "Today",
      time: "11:00pm",
      status: "Completed",
      statusColor: "text-gray-400",
      dotColor: "bg-gray-400",
    },
    {
      id: "14",
      type: "sell",
      date: "Today",
      time: "11:00pm",
      status: "Completed",
      statusColor: "text-gray-400",
      dotColor: "bg-gray-400",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="bg-black max-w-4xl mx-auto text-white min-h-screen flex flex-col">
      {/* Orders Section */}
      <div className="flex-1 p-4 sm:p-6">
        {/* Your Orders Header */}
        <motion.div 
          className="mb-4 sm:mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6 text-white">Your Orders</h2>

          {/* Tabs */}
          <div className="flex space-x-2 sm:space-x-3 justify-center">
            {["All", "Buy", "Sell"].map((tab, index) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-8 sm:px-16 py-1 rounded-sm font-medium text-sm sm:text-base transition-all ${
                  activeTab === tab.toLowerCase()
                    ? "bg-[#622DBF] text-white shadow-lg shadow-purple-600/25"
                    : "bg-[#101010] text-white border border-[#3E3E3E] hover:bg-gray-700/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Ongoing Section */}
        <motion.div 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 text-left sm:text-center">Ongoing</h3>
          <motion.div 
            className="space-y-2 sm:space-y-3 bg-[#1C1B1B] p-3 sm:p-4 rounded-lg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {ongoingOrders.map((order, index) => (
                <motion.div
                  key={index}
                  className="grid grid-cols-3 sm:grid-cols-4 items-center justify-between p-3 sm:p-4 bg-[#101010] rounded-lg border border-[#3E3E3E] hover:border-gray-600 transition-colors cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  <div className="flex items-center">
                    {/* Mobile: Status dot on left, Desktop: No dot here */}
                    <motion.div 
                      className={`w-3 h-3 ${order.dotColor} rounded-full mr-2 sm:hidden`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    />
                    <span className="text-sm sm:text-base text-white font-medium truncate">
                      <span className="hidden sm:inline">Order {order.id} {order.type === "buy" ? "(Buy)" : "(Sell)"}</span>
                      <span className="sm:hidden">Order {order.id}</span>
                    </span>
                  </div>
                  <div className="text-center sm:text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-xs sm:text-base text-gray-300">
                        <span className="hidden sm:inline">{order.date}</span>
                        <span className="sm:hidden">Today</span>
                      </span>
                      {/* Mobile: Show buy/sell SVG icon on the right of date */}
                      <motion.img 
                        src={order.type === "buy" ? "/buy.svg" : "/sell.svg"} 
                        alt={order.type} 
                        className="w-4 h-4 sm:hidden"
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs sm:text-base text-gray-300">{order.time}</span>
                  </div>
                  <div className="hidden sm:flex items-center justify-end space-x-1 sm:space-x-2">
                    {/* Desktop: Status dot on right */}
                    <motion.div 
                      className={`w-3 h-3 ${order.dotColor} rounded-full`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    />
                    <span className={`text-base font-medium ${order.statusColor} truncate`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Completed Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 text-left sm:text-center">Completed</h3>
          <motion.div 
            className="space-y-2 sm:space-y-3 bg-[#1C1B1B] p-3 sm:p-4 rounded-lg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {completedOrders.map((order, index) => (
                <motion.div
                  key={index + 5}
                  className="grid grid-cols-3 sm:grid-cols-4 items-center justify-between p-3 sm:p-4 bg-[#101010] rounded-lg border border-[#3E3E3E] hover:border-gray-600 transition-colors cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  <div className="flex items-center">
                    {/* Mobile: Status dot on left, Desktop: No dot here */}
                    <motion.div 
                      className={`w-3 h-3 ${order.dotColor} rounded-full mr-2 sm:hidden`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    />
                    <span className="text-sm sm:text-base text-white font-medium truncate">
                      <span className="hidden sm:inline">Order {order.id}</span>
                      <span className="sm:hidden">Order {order.id}</span>
                    </span>
                  </div>
                  <div className="text-center sm:text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-xs sm:text-base text-gray-300">
                        <span className="hidden sm:inline">{order.date}</span>
                        <span className="sm:hidden">Today</span>
                      </span>
                      {/* Mobile: Show buy/sell SVG icon on the right of date */}
                      <motion.img 
                        src={order.type === "buy" ? "/buy.svg" : "/sell.svg"} 
                        alt={order.type} 
                        className="w-4 h-4 sm:hidden"
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs sm:text-base text-gray-300">{order.time}</span>
                  </div>
                  <div className="hidden sm:flex items-center justify-end space-x-1 sm:space-x-2">
                    {/* Desktop: Status dot on right */}
                    <motion.div 
                      className={`w-3 h-3 ${order.dotColor} rounded-full`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    />
                    <span className={`text-base font-medium ${order.statusColor} truncate`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}