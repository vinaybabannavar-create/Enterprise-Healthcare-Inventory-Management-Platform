'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Lock, Mail, Activity, UserPlus, Hospital, UserCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        hospital_name: '',
        role: 'staff'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { setAuth, token } = useAuthStore();

    // Auto-redirect authenticated users
    useEffect(() => {
        router.prefetch('/dashboard');
        if (typeof window !== 'undefined' && token) {
            router.push('/dashboard');
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Client-side validation for username (Django default: no spaces)
        if (formData.username.includes(' ')) {
            setError('Username cannot contain spaces. Use underscores or dashes instead.');
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                // Login Flow
                console.log('Attempting login for:', formData.username);
                const response = await api.post('token/', {
                    username: formData.username,
                    password: formData.password,
                });
                console.log('Token received');

                const { access, refresh } = response.data;

                // Get user profile
                console.log('Fetching user profile...');
                const userResponse = await api.get('profile/', {
                    headers: { Authorization: `Bearer ${access}` },
                });
                console.log('User profile:', userResponse.data);

                setAuth(userResponse.data, access, refresh);
                console.log('Redirecting to dashboard...');
                router.push('/dashboard');
            } else {
                // Registration Flow
                console.log('Attempting registration for:', formData.username);
                await api.post('register/', {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    hospital_name: formData.hospital_name,
                    role: formData.role
                });

                setSuccess('Account created successfully! You can now sign in.');
                setIsLogin(true); // Switch to login mode
            }
        } catch (err: any) {
            console.error("Auth error:", err.response?.data);

            // Comprehensive error parsing for DRF responses
            let msg = 'An error occurred. Please try again.';

            if (err.response?.data) {
                const data = err.response.data;
                if (data.detail) {
                    msg = data.detail;
                } else if (typeof data === 'object') {
                    // Try to extract the most meaningful error
                    const entries = Object.entries(data);
                    if (entries.length > 0) {
                        const [key, value]: [string, any] = entries[0];
                        const val = Array.isArray(value) ? value[0] : value;
                        // For fields like 'username' or 'email', provide a clearer context
                        if (['username', 'email', 'password'].includes(key)) {
                            msg = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${val}`;
                        } else {
                            msg = typeof val === 'string' ? val : JSON.stringify(val);
                        }
                    }
                }
            }

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6 border border-slate-100"
            >
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 mb-4 transform -rotate-6">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">HealthStock</h2>
                    <p className="text-slate-500 font-medium mt-1">
                        {isLogin ? 'Welcome back, Enterprise Staff' : 'Join the medical network'}
                    </p>
                </div>

                <div className="flex p-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold border border-rose-100"
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-xs font-bold border border-emerald-100"
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400">
                                    <UserCircle className="w-5 h-5" />
                                </span>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="yourname"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                                <p className="text-[10px] text-slate-400 mt-1 ml-1 italic">No spaces allowed. Use underscores if needed.</p>
                            </div>
                        </div>

                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4"
                            >
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-400">
                                            <Mail className="w-5 h-5" />
                                        </span>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="doctor@hospital.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hospital Name</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-400">
                                            <Hospital className="w-5 h-5" />
                                        </span>
                                        <input
                                            name="hospital_name"
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="General Medical Center"
                                            value={formData.hospital_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </span>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                {isLogin ? 'Establish Secure Session' : 'Create Enterprise Account'}
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-4 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        HealthStock Secured Entry • v1.2.0
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
