import BuySellSection from '@/components/buysellSection';
import SimpleNav from '@/components/simple-nav';
import Orders from '@/components/orders';
import AuthGuard from '@/components/auth/AuthGuard';
import React from 'react';

export default function Dashboard() {
    return (
        <AuthGuard requireAuth={true}>
            <div className="bg-black">
                <SimpleNav />
                <BuySellSection />
                <Orders />
            </div>
        </AuthGuard>
    );
}