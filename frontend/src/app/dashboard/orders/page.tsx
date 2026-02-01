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
    Check,
    Truck,
    Clock,
    AlertCircle,
    Package,
    ArrowRight
} from 'lucide-react';
import api from '@/lib/api';

interface OrderItem {
    id: number;
    inventory_item: number;
    inventory_item_name: string;
    inventory_item_sku: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface PurchaseOrder {
    id: number;
    order_number: string;
    supplier: number;
    supplier_name: string;
    order_date: string;
    expected_delivery: string;
    status: 'pending' | 'approved' | 'ordered' | 'delivered' | 'cancelled';
    total_amount: number;
    created_by_name: string;
    items: OrderItem[];
    created_at: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface InventoryItem {
    id: number;
    name: string;
    sku: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [newOrder, setNewOrder] = useState({
        supplier: '',
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery: '',
        notes: '',
        items: [{ inventory_item: '', quantity: 1, unit_price: 0 }]
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [ordersRes, suppliersRes, inventoryRes] = await Promise.all([
                api.get('orders/'),
                api.get('suppliers/'),
                api.get('inventory/')
            ]);
            setOrders(ordersRes.data);
            setSuppliers(suppliersRes.data);
            setInventoryItems(inventoryRes.data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError('Failed to load procurement data stream.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrderItem = () => {
        setNewOrder({
            ...newOrder,
            items: [...newOrder.items, { inventory_item: '', quantity: 1, unit_price: 0 }]
        });
    };

    const handleRemoveOrderItem = (index: number) => {
        setNewOrder({
            ...newOrder,
            items: newOrder.items.filter((_, i) => i !== index)
        });
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...newOrder.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setNewOrder({ ...newOrder, items: updatedItems });
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const orderData = {
            ...newOrder,
            order_number: `PO-${Date.now().toString().slice(-6)}`,
            supplier: parseInt(newOrder.supplier),
            items: newOrder.items.map(item => ({
                ...item,
                inventory_item: parseInt(item.inventory_item),
                quantity: parseInt(item.quantity.toString()),
                unit_price: parseFloat(item.unit_price.toString())
            }))
        };

        try {
            await api.post('orders/', orderData);
            setIsModalOpen(false);
            fetchInitialData();
            setNewOrder({
                supplier: '',
                order_date: new Date().toISOString().split('T')[0],
                expected_delivery: '',
                notes: '',
                items: [{ inventory_item: '', quantity: 1, unit_price: 0 }]
            });
        } catch (err: any) {
            console.error("Order creation error:", err.response?.data);
            setError('Failed to transmit purchase order. Check your terminal logs.');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ordered': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const filteredOrders = orders.filter(order =>
        order.order_number.toLowerCase().includes(search.toLowerCase()) ||
        order.supplier_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Procurement</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage industrial supply chain and purchase records</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => alert("CSV Export initialized...")}
                        className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Create Order
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Orders', value: orders.filter(o => o.status !== 'delivered').length, icon: Package, color: 'text-blue-600' },
                    { label: 'Pending Approval', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'text-amber-600' },
                    { label: 'In Transit', value: orders.filter(o => o.status === 'ordered').length, icon: Truck, color: 'text-purple-600' },
                    { label: 'Delivered (MTD)', value: orders.filter(o => o.status === 'delivered').length, icon: Check, color: 'text-emerald-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by PO number or supplier..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center gap-3 text-rose-700">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

                <div className="overflow-x-auto p-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <th className="px-6 py-4">PO Number</th>
                                <th className="px-6 py-4">Supplier</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded-full w-24" /></td>
                                        <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded-full w-32" /></td>
                                        <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded-full w-20" /></td>
                                        <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded-full w-12" /></td>
                                        <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded-full w-24" /></td>
                                        <td className="px-6 py-6 uppercase text-right tracking-widest"><div className="h-4 bg-slate-100 rounded-full w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-slate-900">{order.order_number}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {(order.supplier_name || '?').charAt(0)}
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">{order.supplier_name || 'Unknown Supplier'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-slate-500">{order.order_date}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-700">{order.items.length}</span>
                                            <span className="text-[10px] font-bold text-slate-400">items</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="text-sm font-black text-slate-900">${order.total_amount.toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
                            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <form onSubmit={handleCreateOrder} className="flex flex-col max-h-[90vh]">
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                            < Truck className="w-8 h-8 text-blue-600" />
                                            Generate Purchase Order
                                        </h2>
                                        <p className="text-slate-500 font-semibold mt-1">Industrial supply chain terminal</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200"
                                    >
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold text-sm"
                                        >
                                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Supplier Entity</label>
                                                <select
                                                    required
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-600 appearance-none cursor-pointer"
                                                    value={newOrder.supplier}
                                                    onChange={e => setNewOrder({ ...newOrder, supplier: e.target.value })}
                                                >
                                                    <option value="">Select Supplier...</option>
                                                    {suppliers.map(s => (
                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Order Date</label>
                                                    <input
                                                        type="date"
                                                        required
                                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-600"
                                                        value={newOrder.order_date}
                                                        onChange={e => setNewOrder({ ...newOrder, order_date: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Expected Arrival</label>
                                                    <input
                                                        type="date"
                                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-600"
                                                        value={newOrder.expected_delivery}
                                                        onChange={e => setNewOrder({ ...newOrder, expected_delivery: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 h-full">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Procurement Notes</label>
                                            <textarea
                                                placeholder="Enter any special handling instructions or contractual notes..."
                                                className="w-full h-[calc(100%-1.75rem)] px-5 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-700 resize-none"
                                                value={newOrder.notes}
                                                onChange={e => setNewOrder({ ...newOrder, notes: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Supply Line Items</h3>
                                            <button
                                                type="button"
                                                onClick={handleAddOrderItem}
                                                className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2 text-sm"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Item
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {newOrder.items.map((item, index) => (
                                                <div key={index} className="flex gap-4 items-end bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                                                    <div className="flex-1 space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product</label>
                                                        <select
                                                            required
                                                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-600 appearance-none cursor-pointer"
                                                            value={item.inventory_item}
                                                            onChange={e => handleItemChange(index, 'inventory_item', e.target.value)}
                                                        >
                                                            <option value="">Select Item...</option>
                                                            {inventoryItems.map(i => (
                                                                <option key={i.id} value={i.id}>{i.name} ({i.sku})</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="w-32 space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            min="1"
                                                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-600"
                                                            value={item.quantity}
                                                            onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="w-40 space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unit CPU ($)</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            min="0"
                                                            step="0.01"
                                                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-600"
                                                            value={item.unit_price}
                                                            onChange={e => handleItemChange(index, 'unit_price', e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveOrderItem(index)}
                                                        disabled={newOrder.items.length === 1}
                                                        className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/50">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                                    >
                                        Cancel Protocol
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <ArrowRight className="w-5 h-5" />
                                        )}
                                        {submitting ? 'Transmitting...' : 'Authorize Purchase Order'}
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
