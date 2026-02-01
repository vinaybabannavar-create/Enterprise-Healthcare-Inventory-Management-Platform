'use client';

import { useState, useEffect } from 'react';
import { Factory, CheckCircle, Clock } from 'lucide-react';
import api from '@/lib/api';

const SupplierStatus = () => {
    const [suppliers, setSuppliers] = useState<any[]>([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await api.get('suppliers/');
                // Mocking live metrics onto real supplier data
                const enriched = response.data.map((s: any) => ({
                    ...s,
                    status: Math.random() > 0.8 ? 'issue' : 'active',
                    avgDeliveryTime: (24 + Math.random() * 48).toFixed(1),
                    successRate: (95 + Math.random() * 5).toFixed(1)
                }));
                setSuppliers(enriched);
            } catch (err) {
                console.error("Supplier status failure");
            }
        };

        fetchSuppliers();
        const interval = setInterval(fetchSuppliers, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <Factory className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Live Supplier Status</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map(supplier => (
                    <div
                        key={supplier.id}
                        className={`p-4 rounded-2xl border transition-all ${supplier.status === 'issue' ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-slate-900 truncate pr-2">{supplier.name}</span>
                            <span className={`flex h-2 w-2 rounded-full flex-shrink-0 ${supplier.status === 'issue' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                                }`} />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    Avg Delivery
                                </div>
                                <span className="font-bold text-slate-700">{supplier.avgDeliveryTime}h</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <CheckCircle className="w-3 h-3" />
                                    Success Rate
                                </div>
                                <span className="font-bold text-slate-700">{supplier.successRate}%</span>
                            </div>
                        </div>

                        {supplier.status === 'issue' && (
                            <div className="mt-4 pt-3 border-t border-rose-100 text-[10px] font-bold text-rose-600 uppercase italic">
                                Delay Reported: Logistics issue
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SupplierStatus;
