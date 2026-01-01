import React, { useState } from 'react';
import { Plus, Store, MapPin, AtSign, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupView = ({ onSignup, addToast }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        storeName: '', location: '', adminUsername: '', adminPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('/api/auth/register-store', formData);
            onSignup();
            if (addToast) addToast("Store Registered Successfully");
            navigate('/login');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Registration failed";
            setError(typeof errorMsg === 'string' ? errorMsg : "Registration failed");
            if (addToast) addToast(typeof errorMsg === 'string' ? errorMsg : "Registration failed", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cred-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cred-gold/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl relative z-10"
            >
                {/* Back Button */}
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-cred-muted hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm">Back to Login</span>
                </button>

                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-gradient-to-br from-cred-gold to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-cred-gold/20"
                    >
                        <Sparkles size={40} className="text-black" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Create Your Store</h1>
                    <p className="text-cred-muted text-sm">Set up your enterprise in minutes</p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-cred-muted ml-1">Store Name</label>
                            <div className="relative">
                                <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-cred-muted" size={20} />
                                <input
                                    type="text"
                                    placeholder="Your store name"
                                    className="input-premium pl-14"
                                    value={formData.storeName}
                                    onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-cred-muted ml-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-cred-muted" size={20} />
                                <input
                                    type="text"
                                    placeholder="City / Area"
                                    className="input-premium pl-14"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-cred-muted ml-1">Admin Username</label>
                            <div className="relative">
                                <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-cred-muted" size={20} />
                                <input
                                    type="text"
                                    placeholder="Choose username"
                                    className="input-premium pl-14"
                                    value={formData.adminUsername}
                                    onChange={e => setFormData({ ...formData, adminUsername: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-cred-muted ml-1">Admin Password</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-cred-muted" size={20} />
                                <input
                                    type="password"
                                    placeholder="Create secure password"
                                    className="input-premium pl-14"
                                    value={formData.adminPassword}
                                    onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl py-3 px-4"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-gold w-full flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-wider"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                Create Store <Plus size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-cred-muted text-xs mt-8">
                    By registering, you agree to our Terms of Service and Privacy Policy
                </p>
            </motion.div>
        </div>
    );
};

export default SignupView;
