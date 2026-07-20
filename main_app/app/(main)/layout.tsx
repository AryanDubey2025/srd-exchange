'use client';

import BottomNavbar from '@/components/bottom-navbar';
import RightSidebar from '@/components/RightSidebar';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black">
            <div className="flex">
                <main className="flex-1 min-w-0 pb-28">
                    {children}
                </main>
                <aside className="hidden lg:block w-[500px] shrink-0 h-[100dvh] sticky top-0 border-l border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden pt-[72px]">
                    <RightSidebar />
                </aside>
            </div>
            <BottomNavbar />
        </div>
    );
}
