import BuySellSection from '@/components/buysellSection';
import SimpleNav from '@/components/simple-nav';
import Orders from '@/components/orders';
import React from 'react';

export default function Dashboard() {
    return (
        <div className="bg-black">
            <SimpleNav />
            
                    <BuySellSection />
              
                
             
                    <Orders />
             
        </div>
    );
}