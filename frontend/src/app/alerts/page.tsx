'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    AlertTriangle,
    ShieldAlert,
    Info,
    CheckCircle2,
    Search,
    Filter,
    Trash2,
    Settings,
    BellOff
} from 'lucide-react';

interface Alert {
    id: number;
    title: string;
    message: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    timestamp: string;
    read: boolean;
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'unread'>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Mock data for initial professional appearance
        setAlerts([
            { id: 1, title: 'Critical Stock Level', message: 'Amoxil 500mg is below 5 units in Main Pharmacy.', type: 'critical', timestamp: '2 mins ago', read: false },
            { id: 2, title: 'Expiring Soon', message: 'Batch #B902 (Saline Sol) expires in 48 hours.', type: 'warning', timestamp: '1 hour ago', read: false },
            { id: 3, title: 'Order Approved', message: 'Purchase Order PO-9921 has been approved by Admin.', type: 'success', timestamp: '3 hours ago', read: true },
            { id: 4, title: 'System Maintenance', message: 'Server synchronization scheduled for 02:00 UTC.', type: 'info', timestamp: '5 hours ago', read: true },
        ]);
    }, []);

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'critical': return <ShieldAlert className="w-6 h-6 text-rose-600" />;
            case 'warning': return <AlertTriangle className="w-6 h-6 text-amber-600" />;
            case 'success': return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
            case 'info': return <Info className="w-6 h-6 text-blue-600" />;
            default: return <Bell className="w-6 h-6 text-slate-600" />;
        }
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'critical': return 'bg-rose-50 border-rose-100';
            case 'warning': return 'bg-amber-50 border-amber-100';
            case 'success': return 'bg-emerald-50 border-emerald-100';
            case 'info': return 'bg-blue-50 border-blue-100';
            default: return 'bg-slate-50 border-slate-100';
        }
    };

    const filteredAlerts = alerts.filter(alert => {
        if (filter === 'unread' && alert.read) return false;
        if (filter === 'critical' && alert.type !== 'critical') return false;
        if (filter === 'warning' && alert.type !== 'warning') return false;
        return alert.title.toLowerCase().includes(search.toLowerCase()) ||
            alert.message.toLowerCase().includes(search.toLowerCase());
    });

    const markAllRead = () => {
        setAlerts(alerts.map(a => ({ ...a, read: true })));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Notifications
                        <span className="px-3 py-1 bg-rose-500 text-white text-xs rounded-full">
                            {alerts.filter(a => !a.read).length} New
                        </span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time health monitoring and system exceptions</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={markAllRead}
                        className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-sm"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark all as read
                    </button>
                    <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-slate-600 transition-all shadow-sm active:scale-95">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[70vh]">
                <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter by keyword..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'unread', label: 'Unread' },
                            { id: 'critical', label: 'Priority' },
                            { id: 'warning', label: 'Warnings' }
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => setFilter(btn.id as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === btn.id
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    <AnimatePresence mode="popLayout">
                        {filteredAlerts.length > 0 ? (
                            <div className="space-y-4">
                                {filteredAlerts.map((alert) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={alert.id}
                                        className={`group relative p-6 rounded-[2rem] border transition-all hover:shadow-md flex gap-5 ${getAlertColor(alert.type)} ${!alert.read ? 'ring-2 ring-blue-500/20' : ''}`}
                                    >
                                        <div className="flex-shrink-0 pt-1">
                                            {getAlertIcon(alert.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                                    {alert.title}
                                                    {!alert.read && <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block" />}
                                                </h3>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{alert.timestamp}</span>
                                            </div>
                                            <p className="text-slate-600 font-medium text-sm leading-relaxed">{alert.message}</p>
                                        </div>
                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-400 hover:text-blue-600 transition-colors">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-400 hover:text-rose-600 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                    <BellOff className="w-10 h-10 text-slate-200" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">System Silenced</h3>
                                    <p className="text-slate-400 font-semibold max-w-xs mt-1">No alerts found matching your current filter criteria.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
