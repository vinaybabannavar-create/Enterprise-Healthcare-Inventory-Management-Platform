'use client';

import { motion } from 'framer-motion';
import { Download, RefreshCw } from 'lucide-react';
import LiveAlerts from '@/components/LiveAlerts';
import AIAssistant from '@/components/AIAssistant';
import RealTimeCharts from '@/components/RealTimeCharts';
import InventoryMap from '@/components/InventoryMap';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';
import SupplierStatus from '@/components/SupplierStatus';
import AuditTrail from '@/components/AuditTrail';
import EmergencyPanel from '@/components/EmergencyPanel';
import WarehouseCamera from '@/components/WarehouseCamera';

import PerformanceMonitor from '@/components/PerformanceMonitor';
import MobileSync from '@/components/MobileSync';

const stats = [
    { label: 'Total Items', value: '1,284', change: '+12%', trend: 'up' },
    { label: 'Stock Value', value: '$84,200', change: '+5%', trend: 'up' },
    { label: 'Active Orders', value: '18', change: '-2', trend: 'down' }
];

export default function DashboardPage() {
    const handleRefresh = () => {
        window.location.reload();
    };

    const handleExport = () => {
        alert("Compiling real-time data into Monthly Enterprise Report... Your download will start shortly.");
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Enterprise Console</h1>
                    <p className="text-gray-500 font-medium">Real-time status of your medical supply chain.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
                    >
                        <Download className="w-5 h-5" />
                        Export Monthly Report
                    </button>
                </div>
            </div>

            {/* Row 1: Analytics & Alerts & AI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <RealTimeCharts />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <LiveAlerts />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <AIAssistant />
                </motion.div>
            </div>

            {/* Row 2: Map & Predictive & Audit */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1">
                    <InventoryMap />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <PredictiveAnalytics />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <AuditTrail />
                </motion.div>
            </div>

            {/* Row 3: Suppliers & Emergency */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2">
                    <SupplierStatus />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                    <EmergencyPanel />
                </motion.div>
            </div>

            {/* Row 4: Camera, Performance & Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    <WarehouseCamera />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
                    <PerformanceMonitor />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
                    <MobileSync />
                </motion.div>
            </div>
        </div>
    );
}
