import React from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const SecurityGate = ({ isOpen, onVerify, onClose }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        if (e.key === 'Enter') {
            onVerify(e.target.value);
        }
    };

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[40px] p-12 max-w-md w-full shadow-2xl">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} className="text-black" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">Access Gate</h3>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">Re-verify your credentials</p>
                </div>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full bg-gray-50 border-none p-6 rounded-2xl mb-8 focus:ring-2 ring-black/5"
                    onKeyDown={handleSubmit}
                    autoFocus
                />
                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-gray-50 rounded-2xl">Cancel</button>
                    <button
                        onClick={() => onVerify(document.querySelector('input[type="password"]').value)}
                        className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-black text-white rounded-2xl"
                    >
                        Proceed
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SecurityGate;
