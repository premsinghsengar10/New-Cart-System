import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[5000] 
                flex items-center gap-3 py-4 px-6 rounded-2xl
                ${isSuccess
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
                    : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30'
                }
                backdrop-blur-xl shadow-2xl`}
        >
            <div className={`p-2 rounded-xl ${isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {isSuccess
                    ? <CheckCircle2 size={20} className="text-green-400" />
                    : <AlertCircle size={20} className="text-red-400" />
                }
            </div>
            <p className="text-white font-medium text-sm">{message}</p>
            <button
                onClick={onClose}
                className="ml-2 p-1 text-white/50 hover:text-white transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default Toast;
