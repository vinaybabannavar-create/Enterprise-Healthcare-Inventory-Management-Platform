'use client';

import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';

export default function RootLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main className="pl-64 min-h-screen">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {user?.hospital_name || 'Hospital Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
