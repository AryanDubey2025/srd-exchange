'use client';

import BottomNavbar from '@/components/bottom-navbar';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black pb-28">
            {children}
            <BottomNavbar />
        </div>
    );
}
