import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const CartView = ({ cart, onRemove }) => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-10 text-left">
        <div>
            <h1 className="text-5xl font-black">Basket</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">Inventory Selection</p>
        </div>
        <div className="space-y-4">
            {cart?.items?.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-50">
                    <ShoppingBag size={48} className="mx-auto mb-6 text-gray-100" />
                    <p className="text-gray-400 font-bold">Your basket is empty</p>
                </div>
            ) : (
                cart?.items?.map((item, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={index}
                        className="flex justify-between items-center p-8 bg-white rounded-[32px] border border-gray-50 shadow-sm"
                    >
                        <div className="flex-1">
                            <p className="font-extrabold text-gray-900 text-xl">{item.productName}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">SN {item.serialNumber}</p>
                        </div>
                        <div className="flex items-center gap-8">
                            <span className="font-black text-2xl text-gray-900">${item.price.toFixed(2)}</span>
                            <button
                                onClick={() => onRemove(item.serialNumber)}
                                className="p-4 bg-gray-50 text-black hover:bg-black hover:text-white rounded-2xl border-none shadow-none transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
        {cart?.items?.length > 0 && (
            <div className="mt-12 p-10 bg-black text-white rounded-[40px] flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">Checkout Value</p>
                    <p className="text-6xl font-black">${cart.totalAmount.toFixed(2)}</p>
                </div>
                <div className="absolute right-[-20px] top-[-20px] opacity-10">
                    <ShoppingBag size={180} />
                </div>
            </div>
        )}
    </motion.div>
);

export default CartView;
