"use client";

import { useState } from "react";

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

  return (
    <div className="bg-black max-w-4xl mx-auto text-white min-h-screen flex flex-col">
      {/* Orders Section */}
      <div className="flex-1 p-4 sm:p-6">
        {/* Your Orders Header */}
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6 text-white">Your Orders</h2>

          {/* Tabs */}
          <div className="flex space-x-2 sm:space-x-3 justify-center">
            {["All", "Buy", "Sell"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-8 sm:px-16 py-1 rounded-sm font-medium text-sm sm:text-base transition-all ${
                  activeTab === tab.toLowerCase()
                    ? "bg-[#622DBF] text-white shadow-lg shadow-purple-600/25"
                    : "bg-[#101010] text-white border border-[#3E3E3E] hover:bg-gray-700/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Ongoing Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 text-left sm:text-center">Ongoing</h3>
          <div className="space-y-2 sm:space-y-3 bg-[#1C1B1B] p-3 sm:p-4 rounded-lg">
            {ongoingOrders.map((order, index) => (
              <div
                key={index}
                className="grid grid-cols-3 sm:grid-cols-4 items-center justify-between p-3 sm:p-4 bg-[#101010] rounded-lg border border-[#3E3E3E] hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  {/* Mobile: Status dot on left, Desktop: No dot here */}
                  <div className={`w-3 h-3 ${order.dotColor} rounded-full mr-2 sm:hidden`}></div>
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
                    <img 
                      src={order.type === "buy" ? "/buy.svg" : "/sell.svg"} 
                      alt={order.type} 
                      className="w-4 h-4 sm:hidden" 
                    />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs sm:text-base text-gray-300">{order.time}</span>
                </div>
                <div className="hidden sm:flex items-center justify-end space-x-1 sm:space-x-2">
                  {/* Desktop: Status dot on right */}
                  <div className={`w-3 h-3 ${order.dotColor} rounded-full`}></div>
                  <span className={`text-base font-medium ${order.statusColor} truncate`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Section */}
        <div>
          <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 text-left sm:text-center">Completed</h3>
          <div className="space-y-2 sm:space-y-3 bg-[#1C1B1B] p-3 sm:p-4 rounded-lg">
            {completedOrders.map((order, index) => (
              <div
                key={index + 5}
                className="grid grid-cols-3 sm:grid-cols-4 items-center justify-between p-3 sm:p-4 bg-[#101010] rounded-lg border border-[#3E3E3E] hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  {/* Mobile: Status dot on left, Desktop: No dot here */}
                  <div className={`w-3 h-3 ${order.dotColor} rounded-full mr-2 sm:hidden`}></div>
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
                    <img 
                      src={order.type === "buy" ? "/buy.svg" : "/sell.svg"} 
                      alt={order.type} 
                      className="w-4 h-4 sm:hidden" 
                    />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs sm:text-base text-gray-300">{order.time}</span>
                </div>
                <div className="hidden sm:flex items-center justify-end space-x-1 sm:space-x-2">
                  {/* Desktop: Status dot on right */}
                  <div className={`w-3 h-3 ${order.dotColor} rounded-full`}></div>
                  <span className={`text-base font-medium ${order.statusColor} truncate`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}