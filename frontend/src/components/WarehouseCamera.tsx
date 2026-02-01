'use client';

import { Camera, RefreshCw, Maximize2 } from 'lucide-react';
import { useState } from 'react';

const WarehouseCamera = () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-slate-600" />
                    Live Warehouse Feed
                </h3>
                <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 group">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <Camera className="w-12 h-12 text-slate-700 mx-auto mb-2" />
                        <p className="text-slate-500 text-xs font-medium italic">Establishing encrypted visual link...</p>
                    </div>
                </div>

                {/* Mock Static overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uWUicKg/giphy.gif')] bg-cover" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter opacity-80">Cam-04 • Main Entrance</span>
                </div>

                <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white opacity-50">
                    2026-01-31 20:25:42
                </div>
            </div>
        </div>
    );
};

export default WarehouseCamera;
