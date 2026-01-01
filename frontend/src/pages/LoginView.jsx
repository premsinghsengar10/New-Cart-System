import React, { useState } from 'react';
import { ShieldCheck, AtSign, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginView = ({ onLogin, addToast }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/login', { username, password });
            onLogin(res.data);
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Login failed";
            setError(typeof errorMsg === 'string' ? errorMsg : "Login failed");
            if (addToast) addToast(typeof errorMsg === 'string' ? errorMsg : "Login failed", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cred-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cred-gold/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-gradient-to-br from-cred-gold to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-cred-gold/20"
                    >
                        <ShieldCheck size={40} className="text-black" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-cred-muted text-sm">Enter your credentials to access your store</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-cred-muted ml-1">Username</label>
                        <div className="relative">
                            <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-cred-muted" size={20} />
                            <input
                                type="text"
                                placeholder="Enter username"
                                className="input-premium pl-14"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-cred-muted ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-cred-muted" size={20} />
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="input-premium pl-14"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
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
                                Sign In <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-cred-border" />
                    <span className="text-cred-muted text-xs uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-cred-border" />
                </div>

                {/* Register Link */}
                <button
                    onClick={() => navigate('/signup')}
                    className="btn-dark w-full flex items-center justify-center gap-3 text-sm"
                >
                    <Sparkles size={18} className="text-cred-gold" />
                    Register New Store
                </button>

                {/* Footer */}
                <p className="text-center text-cred-muted text-xs mt-8">
                    By signing in, you agree to our Terms of Service
                </p>
            </motion.div>
        </div>
    );
};

export default LoginView;
