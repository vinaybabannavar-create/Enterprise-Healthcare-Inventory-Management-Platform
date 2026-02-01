'use client';

import { useEffect, useState } from 'react';
import { History, User as UserIcon, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuditLog {
    timestamp: string;
    userName: string;
    userRole: string;
    action: string;
    target: string;
}

const AuditTrail = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        // Establishing a WebSocket for the audit trail
        const socket = new WebSocket('ws://127.0.0.1:8000/ws/live/');

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'AUDIT_LOG') {
                setLogs(prev => [data.log, ...prev.slice(0, 49)]);
            }
        };

        // Simulating some initial logs
        setLogs([
            { timestamp: new Date().toISOString(), userName: "admin", userRole: "admin", action: "Updated stock", target: "Paracetamol" },
            { timestamp: new Date(Date.now() - 500000).toISOString(), userName: "j.doe", userRole: "staff", action: "Requested restock", target: "N95 Masks" },
        ]);

        return () => socket.close();
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                    <History className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Live Audit Trail</h3>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                <AnimatePresence>
                    {logs.map((log, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-900">{log.userName}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 uppercase font-bold">{log.userRole}</span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    {log.action} <span className="font-medium text-slate-700">{log.target}</span>
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AuditTrail;
