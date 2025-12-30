import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, subtitle, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-white rounded-[44px] p-10 max-w-xl w-full shadow-2xl relative">
                <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all">
                    <X size={20} />
                </button>
                <div className="mb-10 text-left">
                    <h3 className="text-3xl font-black tracking-tight">{title}</h3>
                    {subtitle && <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{subtitle}</p>}
                </div>
                {children}
            </motion.div>
        </div>
    );
};

export default Modal;
