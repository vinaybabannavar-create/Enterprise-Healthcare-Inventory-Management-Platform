'use client';

import { useState, useEffect } from 'react';
import { Activity, Database, Cpu, HardDrive, Zap } from 'lucide-react';

const PerformanceMonitor = () => {
    const [metrics, setMetrics] = useState({
        cpu: 12,
        memory: 45,
        latency: 18,
        uptime: '99.98%'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() * 10 - 5))),
                memory: Math.max(20, Math.min(80, prev.memory + (Math.random() * 2 - 1))),
                latency: Math.max(2, Math.min(50, prev.latency + (Math.random() * 4 - 2)))
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-slate-800">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                    <Zap className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">System Health</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Real-time Infrastructure</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                        <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU Load</span>
                        <span>{metrics.cpu.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-1000"
                            style={{ width: `${metrics.cpu}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                        <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> Memory</span>
                        <span>{metrics.memory.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-1000"
                            style={{ width: `${metrics.memory}%` }}
                        />
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                        <Database className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">DB Latency</span>
                    </div>
                    <p className="text-xl font-mono font-bold">{metrics.latency.toFixed(0)}<span className="text-xs ml-0.5 opacity-50">ms</span></p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                        <Activity className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Uptime</span>
                    </div>
                    <p className="text-xl font-mono font-bold text-emerald-400">{metrics.uptime}</p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">All Clusters Active</span>
                </div>
                <span className="text-[10px] font-mono text-slate-600">v2.4.1-stable</span>
            </div>
        </div>
    );
};

export default PerformanceMonitor;
