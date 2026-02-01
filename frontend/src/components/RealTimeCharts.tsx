'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import api from '@/lib/api';

const RealTimeCharts = () => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Polling mock analytics since WebSocket for this needs extra backend work
        // In a production app, we would use a WebSocket here
        const interval = setInterval(async () => {
            try {
                const response = await api.get('metrics/live/');
                setData(prev => [...prev.slice(-14), response.data]);
            } catch (err) {
                console.error("Failed to fetch live metrics");
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Live Platform Metrics
                </h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-xs text-slate-500 font-medium">Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-xs text-slate-500 font-medium">Stock Outs</span>
                    </div>
                </div>
            </div>

            <div className="h-[250px] w-full min-w-0 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="time"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#94a3b8' }}
                        />
                        <YAxis
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#94a3b8' }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                fontSize: '12px'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="incomingOrders"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={false}
                            animationDuration={500}
                        />
                        <Line
                            type="monotone"
                            dataKey="stockOuts"
                            stroke="#f97316"
                            strokeWidth={3}
                            dot={false}
                            animationDuration={500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RealTimeCharts;
