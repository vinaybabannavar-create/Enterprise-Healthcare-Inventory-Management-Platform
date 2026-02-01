'use client';

import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Map as MapIcon, Globe } from 'lucide-react';
import api from '@/lib/api';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Warehouse {
    id: number;
    name: string;
    lat: number;
    lng: number;
    stockLevel: number;
    status: string;
}

const InventoryMap = () => {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await api.get('warehouses/live/');
                setWarehouses(response.data);
            } catch (err) {
                console.error("Map data fetch failed");
            }
        };

        fetchLocations();
        const interval = setInterval(fetchLocations, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-600" />
                    Global Inventory Map
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-slate-500">Live</span>
                </div>
            </div>

            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 h-[250px]">
                <ComposableMap projectionConfig={{ scale: 140 }}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo: any) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="#e2e8f0"
                                    stroke="#cbd5e1"
                                    strokeWidth={0.5}
                                />
                            ))
                        }
                    </Geographies>
                    {warehouses.map((warehouse) => (
                        <Marker key={warehouse.id} coordinates={[warehouse.lng, warehouse.lat]}>
                            <circle
                                r={6}
                                className={warehouse.status === 'critical' ? 'fill-rose-500 animate-pulse' : 'fill-emerald-500'}
                                stroke="#fff"
                                strokeWidth={2}
                            />
                            <text
                                textAnchor="middle"
                                y={-12}
                                style={{ fontSize: 8, fontWeight: 600, fill: '#475569' }}
                            >
                                {warehouse.name}
                            </text>
                        </Marker>
                    ))}
                </ComposableMap>
            </div>
        </div>
    );
};

export default InventoryMap;
