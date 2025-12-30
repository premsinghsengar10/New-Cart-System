import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[2000] w-[calc(100%-3rem)] max-w-sm flex items-center gap-3 bg-black text-white rounded-2xl py-4 px-6 shadow-2xl"
        >
            <div className="bg-white/10 p-1.5 rounded-lg">
                {type === 'success' ? <CheckCircle2 size={18} className="text-white" /> : <AlertCircle size={18} className="text-red-400" />}
            </div>
            <p className="text-sm font-semibold tracking-tight">{message}</p>
        </motion.div>
    );
};

export default Toast;
