'use client';

import { useState, useEffect } from 'react';
import { Brain, ArrowUp, ArrowDown, ShieldCheck, ShieldAlert } from 'lucide-react';
import api from '@/lib/api';

const PredictiveAnalytics = () => {
    const [predictions, setPredictions] = useState<any>(null);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await api.get('predictions/stock-forecast/');
                setPredictions(response.data);
            } catch (err) {
                console.error("Forecasting failed");
            }
        };

        fetchPredictions();
        const interval = setInterval(fetchPredictions, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!predictions) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Predictive Analytics</h3>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                        <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Demand Forecast</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-slate-900">{Math.abs(predictions.demandChange)}%</span>
                            <span className={`flex items-center gap-0.5 text-xs font-bold ${predictions.demandChange > 0 ? 'text-emerald-600' : 'text-rose-600'
                                }`}>
                                {predictions.demandChange > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                {predictions.demandChange > 0 ? 'Increase' : 'Decrease'}
                            </span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Stockout Risk</p>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${predictions.stockoutRisk === 'high' ? 'bg-rose-500' :
                                predictions.stockoutRisk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                }`} />
                            <span className="text-sm font-bold capitalize text-slate-700">{predictions.stockoutRisk}</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Confidence</p>
                        <span className="text-sm font-bold text-slate-700">94.2%</span>
                    </div>
                </div>

                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-indigo-700 mb-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-tight">AI Recommendation</span>
                        </div>
                        <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                            {predictions.recommendation}
                        </p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 text-indigo-100 group-hover:text-indigo-200 transition-colors transform rotate-12">
                        <Brain className="w-24 h-24" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalytics;
