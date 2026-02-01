'use client';

import { Smartphone, QrCode, RefreshCw, CheckCircle2 } from 'lucide-react';

const MobileSync = () => {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Mobile Integration</h3>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center p-2 group cursor-pointer relative">
                    <QrCode className="w-full h-full text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-bold text-indigo-600 text-center px-1">Pair Device</span>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                            <Smartphone className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">iPhone 15 Pro • JH</p>
                            <p className="text-[10px] text-emerald-600 font-medium">Synced 2m ago</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 opacity-60">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                            <Smartphone className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">iPad Air • Lab 04</p>
                            <p className="text-[10px] text-slate-500 font-medium">Offline</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-2">
                <button className="flex-1 py-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors uppercase tracking-widest">
                    Manage Devices
                </button>
                <button className="flex-1 py-2 text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors uppercase tracking-widest">
                    Download App
                </button>
            </div>
        </div>
    );
};

export default MobileSync;
