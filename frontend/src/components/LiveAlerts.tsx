'use client';

import { useEffect, useState } from 'react';
import { Bell, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
    id: number;
    itemName: string;
    message: string;
    severity: string;
    timestamp: string;
}

const LiveAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        // Subscribe to alert events
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const eventSource = new EventSource(`${baseURL}/alerts/stream/`);

        eventSource.onmessage = (event) => {
            const alert = JSON.parse(event.data);
            setAlerts(prev => [alert, ...prev.slice(0, 5)]);

            // Show browser notification if possible
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                new Notification('HealthStock Alert', {
                    body: `${alert.itemName}: ${alert.message}`,
                });
            }
        };

        return () => eventSource.close();
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Live Alerts
                </h3>
                <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
            </div>
            <div className="space-y-3">
                <AnimatePresence>
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                        >
                            <div className={`p-2 rounded-lg ${alert.severity === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                <ShieldAlert className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{alert.itemName}</p>
                                <p className="text-xs text-gray-500 truncate">{alert.message}</p>
                            </div>
                            <span className="text-[10px] text-gray-400">
                                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </motion.div>
                    ))}
                    {alerts.length === 0 && (
                        <p className="text-sm text-center text-gray-400 py-8 italic">Waiting for incoming alerts...</p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LiveAlerts;
