'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserPlus,
    Shield,
    ShieldCheck,
    Mail,
    MoreVertical,
    Search,
    Filter,
    UserCircle
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

interface StaffMember {
    id: number;
    username: string;
    email: string;
    role: string;
    hospital_name: string;
}

export default function StaffPage() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const fetchStaff = async () => {
            console.log('Fetching staff list...');
            try {
                const response = await api.get('staff-list/');
                console.log('Staff API Response:', response.data);
                console.log('Is Array?', Array.isArray(response.data));
                console.log('Length:', response.data?.length);
                setStaff(Array.isArray(response.data) ? response.data : []);
                setError('');
            } catch (err: any) {
                console.error("Failed to fetch staff", err);
                console.error("Error response:", err.response?.data);
                console.error("Error status:", err.response?.status);
                setError("Failed to synchronize staff records.");
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    const filteredStaff = staff.filter(s =>
        s.username.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Staff Management</h1>
                    <p className="text-gray-500 font-medium">Manage permissions and team access for {user?.hospital_name}.</p>
                </div>
                {isAdmin && (
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200">
                        <UserPlus className="w-5 h-5" />
                        Invite Member
                    </button>
                )}
            </div>

            {/* Status Messages */}
            {!isAdmin && !error && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-700">
                    <Shield className="w-5 h-5" />
                    <p className="text-sm font-bold uppercase tracking-tight">Staff View: Some administrative actions are restricted.</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <p className="text-sm font-bold uppercase tracking-tight">{error}</p>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-center">
                <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50/50">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Find staff by name or email..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 alphabet uppercase tracking-widest">Team Member</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Level</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-6"><div className="h-4 bg-slate-100 rounded-full w-3/4"></div></td>
                                    </tr>
                                ))
                            ) : filteredStaff.length > 0 ? (
                                filteredStaff.map((member, idx) => (
                                    <motion.tr
                                        key={member.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-blue-50/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <UserCircle className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">{member.username}</span>
                                                    <span className="text-xs text-slate-400">{member.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {member.role === 'admin' ? (
                                                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                    <Shield className="w-4 h-4 text-slate-400" />
                                                )
                                                }
                                                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${member.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {member.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Online
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
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic font-medium bg-slate-50/20">
                                        No staff members found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
