'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCircle, Mail, Hospital, Shield, Calendar } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
    const user = useAuthStore((state) => state.user);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 1, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        <div className="bg-blue-600 h-24 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute -bottom-10 left-8">
                                <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-xl">
                                    <div className="w-full h-full rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <UserCircle className="w-12 h-12" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-14 p-8 space-y-6">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900">{user?.username}</h2>
                                <p className="text-slate-500 font-medium capitalize">{user?.role} Account</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-slate-700">{user?.email || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                        <Hospital className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Affiliated Hospital</p>
                                        <p className="text-sm font-bold text-slate-700">{user?.hospital_name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Clearance</p>
                                        <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Level 3 • Full Access</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
                                >
                                    Close View
                                </button>
                                <button
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
