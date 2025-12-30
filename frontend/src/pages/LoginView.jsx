import React, { useState } from 'react';
import { ShieldCheck, AtSign, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginView = ({ onLogin }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', { username, password });
            onLogin(res.data);
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Login failed";
            setError(typeof errorMsg === 'string' ? errorMsg : "Login failed");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto py-20 px-6">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <ShieldCheck size={32} className="text-white" />
                </div>
                <h2 className="text-4xl font-black tracking-tight">Access Control</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Enter credentials to proceed</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Identity</label>
                    <div className="relative">
                        <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Username"
                            className="pl-14 py-5 rounded-2xl bg-white border-2 border-gray-50 focus:border-black"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Secret</label>
                    <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="pl-14 py-5 rounded-2xl bg-white border-2 border-gray-50 focus:border-black"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}
                <button type="submit" className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl">
                    Authorize Entry
                </button>
            </form>

            <div className="mt-12 text-center">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">New Enterprise?</p>
                <button
                    onClick={() => navigate('/signup')}
                    className="mt-4 bg-transparent border-none shadow-none text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:gap-4 transition-all"
                >
                    Register Store <ChevronRight size={16} />
                </button>
            </div>
        </motion.div>
    );
};

export default LoginView;
