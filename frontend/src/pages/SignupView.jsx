import React, { useState } from 'react';
import { Plus, Store, MapPin, AtSign, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupView = ({ onSignup }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        storeName: '', location: '', adminUsername: '', adminPassword: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register-store', formData);
            onSignup();
            navigate('/login');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Registration failed";
            setError(typeof errorMsg === 'string' ? errorMsg : "Registration failed");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto py-16 px-6">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Plus size={32} className="text-white" />
                </div>
                <h2 className="text-4xl font-black tracking-tight">Enterprise Onboarding</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-3">Expand your footprint</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-8 gap-y-8">
                <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Store Designation</label>
                    <div className="relative">
                        <Store className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Store Name"
                            className="pl-14 py-5 border-2 border-gray-50"
                            value={formData.storeName}
                            onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Geographic Hub</label>
                    <div className="relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Location"
                            className="pl-14 py-5 border-2 border-gray-50"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Admin Identity</label>
                    <div className="relative">
                        <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Admin Username"
                            className="pl-14 py-5 border-2 border-gray-50"
                            value={formData.adminUsername}
                            onChange={e => setFormData({ ...formData, adminUsername: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Admin Secret</label>
                    <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="password"
                            placeholder="Admin Password"
                            className="pl-14 py-5 border-2 border-gray-50"
                            value={formData.adminPassword}
                            onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
                            required
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest col-span-2">{error}</p>}
                <button type="submit" className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl col-span-2">
                    Confirm Registration
                </button>
            </form>
        </motion.div>
    );
};

export default SignupView;
