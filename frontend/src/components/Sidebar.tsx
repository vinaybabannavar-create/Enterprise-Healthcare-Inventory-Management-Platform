'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Bell,
    FileText,
    Users,
    Settings,
    LogOut,
    Activity
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

import { useState } from 'react';
import UserProfileModal from './UserProfileModal';

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/' },
    { icon: Package, label: 'Inventory', href: '/inventory' },
    { icon: ShoppingCart, label: 'Orders', href: '/orders' },
    { icon: Bell, label: 'Alerts', href: '/alerts' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: Users, label: 'Staff', href: '/staff' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-50">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg leading-none">HealthStock</h1>
                        <span className="text-xs text-slate-500">Enterprise Edition</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="w-full group px-4 py-3 rounded-2xl hover:bg-slate-800 transition-all text-left"
                    >
                        <p className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                            {user?.username}
                        </p>
                        <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-tight">
                            {user?.role} Profile
                        </p>
                    </button>
                </div>
            </aside>

            <UserProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </>
    );
}
