'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Filter,
    Download,
    MoreVertical,
    X,
    Check
} from 'lucide-react';
import api from '@/lib/api';

interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    category: string;
    quantity: number;
    unit: string;
    minimum_stock: number;
    expiry_date: string;
    expiry_status: string;
}

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        sku: '',
        category: 'medicine',
        quantity: 0,
        unit: 'pcs',
        minimum_stock: 10
    });

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await api.get('inventory/');
            setItems(response.data);
            setError('');
        } catch (err: any) {
            console.error(err);
            setError('Failed to refresh data stream.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await api.post('inventory/', newItem);
            setIsModalOpen(false);
            fetchInventory();
            setNewItem({ name: '', sku: '', category: 'medicine', quantity: 0, unit: 'pcs', minimum_stock: 10 });
        } catch (err: any) {
            console.error("Inventory error:", err.response?.data);

            let msg = 'Failed to commit item. Check SKU uniqueness.';
            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data === 'object') {
                    const firstKey = Object.keys(data)[0];
                    const errorVal = data[firstKey];
                    msg = `${firstKey}: ${Array.isArray(errorVal) ? errorVal[0] : errorVal}`;
                }
            }
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleExport = () => {
        alert("Preparing CSV export... Your download will start shortly.");
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Inventory Control</h1>
                    <p className="text-gray-500 font-medium">Manage hospital stock and procurements.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-600 bg-white shadow-sm"
                    >
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Item
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50/50">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, SKU, or category..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center gap-3 text-rose-700">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product & SKU</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-6"><div className="h-4 bg-slate-100 rounded-full w-3/4"></div></td>
                                    </tr>
                                ))
                            ) : filteredItems.length > 0 ? (
                                filteredItems.map((item, idx) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-blue-50/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{item.name}</span>
                                                <span className="text-[10px] font-mono text-slate-400 uppercase">{item.sku}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-tight">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-bold ${item.quantity < item.minimum_stock ? 'text-amber-600' : 'text-slate-700'}`}>
                                                    {item.quantity}
                                                </span>
                                                <span className="text-xs text-slate-400">{item.unit}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2 py-1 rounded-full ${item.quantity < item.minimum_stock
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                <div className={`w-1 h-1 rounded-full ${item.quantity < item.minimum_stock ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                                {item.quantity < item.minimum_stock ? 'Low Stock' : 'Optimal'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                                        No matches found for your search criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Item Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                        {newItem.category === 'medicine' ? 'Add Medicine' : newItem.category === 'equipment' ? 'Add Equipment' : 'Add Consumable'}
                                    </h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Stock Entry System</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all active:scale-95"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddItem} className="p-8 space-y-5">
                                {error && (
                                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g., Amoxicillin 500mg"
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                                                value={newItem.name}
                                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SKU Code</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="SKU-8829"
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-mono text-sm font-bold text-slate-600 placeholder:text-slate-300"
                                                value={newItem.sku}
                                                onChange={e => setNewItem({ ...newItem, sku: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                            <select
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-600 appearance-none cursor-pointer"
                                                value={newItem.category}
                                                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                            >
                                                <option value="medicine">Medicine</option>
                                                <option value="equipment">Equipment</option>
                                                <option value="consumable">Consumable</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Initial Stock</label>
                                            <input
                                                type="number"
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                                                value={newItem.quantity}
                                                onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unit</label>
                                            <select
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-600 appearance-none cursor-pointer"
                                                value={newItem.unit}
                                                onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                            >
                                                <option value="pcs">Pieces</option>
                                                <option value="vials">Vials</option>
                                                <option value="boxes">Boxes</option>
                                                <option value="packs">Packs</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Min. Threshold</label>
                                            <input
                                                type="number"
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                                                value={newItem.minimum_stock}
                                                onChange={e => setNewItem({ ...newItem, minimum_stock: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-8 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Plus className="w-5 h-5 stroke-[3px]" />
                                        )}
                                        {submitting ? 'Committing...' : 'Commit to Ledger'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
