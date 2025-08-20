import React from 'react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">Total Balance</h2>
                        <p className="text-3xl font-bold text-green-600">$12,345.67</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">Active Trades</h2>
                        <p className="text-3xl font-bold text-blue-600">5</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">Completed Trades</h2>
                        <p className="text-3xl font-bold text-gray-600">23</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span>Bitcoin Purchase</span>
                                <span className="text-green-600">+0.005 BTC</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span>Ethereum Sale</span>
                                <span className="text-red-600">-0.5 ETH</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                                Create New Trade
                            </button>
                            <button className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700">
                                View All Trades
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}