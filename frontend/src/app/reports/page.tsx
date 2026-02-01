'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Download,
    Calendar,
    PieChart,
    BarChart3,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Search,
    ChevronDown,
    FileSpreadsheet,
    FileText,
    Activity
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const data = [
    { name: 'Jan', consumption: 4000, procurement: 2400 },
    { name: 'Feb', consumption: 3000, procurement: 1398 },
    { name: 'Mar', consumption: 2000, procurement: 9800 },
    { name: 'Apr', consumption: 2780, procurement: 3908 },
    { name: 'May', consumption: 1890, procurement: 4800 },
    { name: 'Jun', consumption: 2390, procurement: 3800 },
];

export default function ReportsPage() {
    const [period, setPeriod] = useState('This Quarter');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Intelligence Center
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Cross-departmental analytics and fiscal audit logs</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-sm">
                        <Calendar className="w-4 h-4" />
                        {period}
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
                        <Download className="w-5 h-5" />
                        Generate Master Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial Velocity</h3>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Consumption vs Procurement Flux</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-600" />
                                <span className="text-xs font-bold text-slate-500">Consumption</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-slate-200" />
                                <span className="text-xs font-bold text-slate-500">Procurement</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full mt-4 min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                />
                                <Area type="monotone" dataKey="consumption" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorConsumption)" />
                                <Area type="monotone" dataKey="procurement" stroke="#e2e8f0" strokeWidth={4} fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl space-y-8 flex flex-col justify-between overflow-hidden relative group">
                    <Activity className="absolute -right-4 -top-4 w-40 h-40 text-white/5 rotate-12 transition-transform group-hover:scale-110" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-white tracking-tight">Health Status</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Global inventory liquidity</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { label: 'Asset Valuation', value: '$2.4M', trend: '+12.5%', isUp: true },
                            { label: 'Stock Turnover', value: '4.2x', trend: '+0.8x', isUp: true },
                            { label: 'Expiring Risk', value: '$12k', trend: '-2.4%', isUp: false },
                        ].map((metric, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{metric.label}</span>
                                    <span className={`text-[10px] font-black underline decoration-2 ${metric.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {metric.trend}
                                    </span>
                                </div>
                                <p className="text-3xl font-black text-white">{metric.value}</p>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-4 bg-white/10 hover:bg-white/15 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-white/10 group/btn">
                        View Detailed Audit
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Consumption Distribution</h3>
                        <PieChart className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'General Medicine', value: '45%', color: 'bg-blue-600' },
                            { label: 'Surgical Gear', value: '25%', color: 'bg-emerald-600' },
                            { label: 'Diagnostics', value: '18%', color: 'bg-amber-600' },
                            { label: 'Emergency', value: '12%', color: 'bg-rose-600' },
                        ].map((cat, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-2xl space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.label}</span>
                                </div>
                                <p className="text-xl font-black text-slate-900">{cat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Available Reports</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Find report..."
                                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Monthly Stock Valuation', type: 'Excel', size: '2.4 MB', icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { name: 'Supplier Performance Audit', type: 'PDF', size: '1.1 MB', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { name: 'Inventory Consumption Q3', type: 'Excel', size: '4.8 MB', icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        ].map((report, i) => (
                            <div key={i} className="group flex items-center justify-between p-4 bg-white border border-slate-50 rounded-[1.5rem] hover:border-slate-200 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl ${report.bg} flex items-center justify-center ${report.color}`}>
                                        <report.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{report.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{report.type} • {report.size}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
