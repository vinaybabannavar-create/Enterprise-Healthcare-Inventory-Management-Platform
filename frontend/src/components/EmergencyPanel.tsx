'use client';

import { ShieldAlert, Zap, Truck, Users } from 'lucide-react';

const EmergencyPanel = () => {
    const triggerEmergency = (type: string) => {
        alert(`EMERGENCY TRIGGERED: ${type.toUpperCase()}\nBroadcasting to all departments and suppliers...`);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-rose-600">
                <div className="p-2 bg-rose-100 rounded-xl">
                    <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Emergency Response</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                    onClick={() => triggerEmergency('stockout')}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all group"
                >
                    <div className="p-3 bg-white rounded-xl shadow-sm text-rose-600 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-rose-700 text-center uppercase tracking-wider">Critical Stockout</span>
                </button>

                <button
                    onClick={() => triggerEmergency('recall')}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-all group"
                >
                    <div className="p-3 bg-white rounded-xl shadow-sm text-amber-600 group-hover:scale-110 transition-transform">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-amber-700 text-center uppercase tracking-wider">Product Recall</span>
                </button>

                <button
                    onClick={() => triggerEmergency('supplier')}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all group"
                >
                    <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                        <Truck className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-indigo-700 text-center uppercase tracking-wider">Supplier Blackout</span>
                </button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold opacity-80 uppercase tracking-widest">Global Watch Active</span>
                </div>
                <button className="text-[10px] font-bold underline opacity-50 hover:opacity-100">View Protocols</button>
            </div>
        </div>
    );
};

export default EmergencyPanel;
