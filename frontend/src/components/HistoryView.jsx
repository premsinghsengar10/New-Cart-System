import React from 'react';
import { History, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const HistoryView = ({ orders }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12 py-10">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-6xl font-black tracking-tighter">Activity</h1>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.4em] mt-3 ml-1">Verified Transaction Ledger</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Total Volume</p>
                <p className="text-3xl font-black mt-1">${orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}</p>
            </div>
        </div>

        <div className="grid gap-8">
            {orders.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[48px] border-2 border-dashed border-gray-50">
                    <History size={64} className="mx-auto mb-8 text-gray-100" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No records found in local node</p>
                </div>
            ) : (
                orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((order, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        key={order.id}
                        className="bg-white p-12 rounded-[48px] shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-50/50"
                    >
                        <div className="flex flex-col md:flex-row justify-between gap-12">
                            <div className="flex-1 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Originator</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5">{order.customerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                        <Phone size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Contact Anchor</p>
                                        <p className="text-lg font-bold text-gray-600 mt-0.5">{order.customerMobile}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-px bg-gray-100 hidden md:block" />

                            <div className="flex-1 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Timestamp</p>
                                        <p className="text-sm font-bold text-gray-900 mt-1">{new Date(order.timestamp).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-green-50 text-green-600 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border border-green-100/50">
                                        Authorized
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-4">Inventory Manifest</p>
                                    <div className="flex flex-wrap gap-2">
                                        {order.items.slice(0, 3).map((item, i) => (
                                            <span key={i} className="bg-gray-50 px-3 py-1.5 rounded-lg text-[9px] font-bold text-gray-500 border border-gray-100">
                                                {item.productName}
                                            </span>
                                        ))}
                                        {order.items.length > 3 && (
                                            <span className="bg-black text-white px-3 py-1.5 rounded-lg text-[9px] font-bold">
                                                +{order.items.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-end items-end min-w-[140px]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">Total Yield</p>
                                <p className="text-5xl font-black text-black tracking-tighter">${order.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    </motion.div>
);

export default HistoryView;
