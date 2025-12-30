import React, { useState, useEffect } from 'react';
import { Scan, ShoppingCart, CreditCard, X, Package, CheckCircle2, Info, User, Phone, History, AlertCircle, ChevronRight, ArrowLeft, Search, ShoppingBag, Store, LogOut, Plus, ShieldCheck, MapPin, AtSign, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// --- Toast Component ---
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

// --- Product Card Component ---
const ProductCard = ({ product, onClick, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(product)}
        className="glass-card product-card group cursor-pointer border-none shadow-sm hover:shadow-xl"
    >
        <div className="product-image-container relative">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
        <div className="w-full pt-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{product.category}</p>
            <p className="font-bold text-gray-900 text-xs leading-tight line-clamp-1">{product.name}</p>
            <p className="text-sm font-black text-black mt-2">${product.price.toFixed(2)}</p>
        </div>
    </motion.div>
);

// --- Inventory Selector ---
const InventorySelector = ({ onAdd, addToast, storeId }) => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [availableUnits, setAvailableUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (storeId) fetchProducts();
    }, [storeId]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`/api/products?storeId=${storeId}`);
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            addToast("Couldn't retrieve catalog", "error");
        }
    };

    const handleProductSelect = async (product) => {
        setLoading(true);
        setSelectedProduct(product);
        try {
            const res = await axios.get(`/api/products/${product.barcode}/units?storeId=${storeId}`);
            setAvailableUnits(res.data);
            setLoading(false);
        } catch (err) {
            addToast("Failed to check inventory", "error");
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && products.length === 0) return <div className="p-12 text-center text-gray-400 font-medium animate-pulse">Establishing connection...</div>;

    return (
        <div className="animate-slide-up">
            <AnimatePresence mode="wait">
                {!selectedProduct ? (
                    <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <Search className="search-icon" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search catalog..."
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-24 text-gray-300">
                                <ShoppingBag size={48} className="mx-auto mb-6 opacity-30" />
                                <p className="text-lg font-medium">No matches found</p>
                            </div>
                        ) : (
                            <div className="product-grid">
                                {filteredProducts.map((p, idx) => (
                                    <ProductCard key={p.id} product={p} index={idx} onClick={handleProductSelect} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="units" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto space-y-8">
                        <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-2 px-0 bg-transparent border-none text-gray-400 hover:text-black shadow-none py-0 font-bold text-xs uppercase tracking-widest">
                            <ArrowLeft size={16} /> Return to catalog
                        </button>

                        <div className="glass-card flex items-center gap-8 text-left border-none bg-white p-10">
                            <img src={selectedProduct.imageUrl} className="w-40 h-40 rounded-2xl object-cover shadow-2xl" />
                            <div className="space-y-3">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{selectedProduct.category}</p>
                                <h3 className="font-extrabold text-3xl text-gray-900 leading-tight">{selectedProduct.name}</h3>
                                <p className="text-2xl text-black font-black">${selectedProduct.price.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Available Units</h2>
                                <span className="bg-black text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase">{availableUnits.length} units left</span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {availableUnits.length === 0 ? (
                                    <div className="col-span-2 text-center py-16 border-2 border-dashed border-gray-100 rounded-[32px]">
                                        <p className="text-gray-400 font-bold">Temporarily Unavailable</p>
                                    </div>
                                ) : (
                                    availableUnits.map((unit, idx) => (
                                        <motion.div
                                            key={unit.serialNumber}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onAdd(unit.serialNumber)}
                                            className="bg-white border border-gray-100 p-6 rounded-3xl cursor-pointer hover:border-black transition-all shadow-sm"
                                        >
                                            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-gray-400">ID: {unit.serialNumber.split('-').pop()}</p>
                                            <p className="text-[10px] font-bold text-black mt-2">TAP TO ADD</p>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Cart View ---
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

// --- History View ---
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

            <button onClick={() => navigate('/login')} className="mt-12 bg-transparent border-none shadow-none text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:text-black">
                <ArrowLeft size={16} /> Back to Entry
            </button>
        </motion.div>
    );
};

// --- Main App ---
const MainApp = ({ user, handleLogout, cart, orders, fetchCart, fetchOrders, activeTab, setActiveTab, handleAdd, handleRemove, handleCheckout, checkoutDetails, setCheckoutDetails, addToast }) => {
    const location = useLocation();

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
                        <CheckCircle2 size={18} className="text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tighter">SCAN&BILL</span>
                </div>
                <div className="nav-links">
                    {user.role === 'SUPER_ADMIN' ? (
                        <button onClick={() => setActiveTab('admin')} className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}>Ecosystem</button>
                    ) : (
                        <>
                            <button onClick={() => setActiveTab('scan')} className={`nav-link ${activeTab === 'scan' ? 'active' : ''}`}>Catalog</button>
                            <button onClick={() => setActiveTab('cart')} className={`nav-link ${activeTab === 'cart' ? 'active' : ''}`}>Basket ({cart?.items?.length || 0})</button>
                            <button onClick={() => setActiveTab('pay')} className={`nav-link ${activeTab === 'pay' ? 'active' : ''}`}>Settle</button>
                            <button onClick={() => setActiveTab('history')} className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}>Log</button>
                            {user.role === 'ADMIN' && (
                                <button onClick={() => setActiveTab('admin')} className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}>Admin</button>
                            )}
                        </>
                    )}
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-black leading-none">{user.username}</p>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">{user.role}</p>
                        </div>
                        <button onClick={handleLogout} className="p-3 bg-gray-50 text-black hover:bg-black hover:text-white rounded-xl shadow-none">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="min-h-[70vh]">
                <AnimatePresence mode="wait">
                    {user.role === 'SUPER_ADMIN' ? (
                        activeTab === 'admin' && (
                            <div className="max-w-4xl mx-auto py-10 px-6">
                                <div className="flex justify-between items-end mb-16">
                                    <div>
                                        <h1 className="text-5xl font-black">Ecosystem</h1>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">Active Node Infrastructure</p>
                                    </div>
                                    <button className="py-4 px-8 rounded-2xl flex items-center gap-3">
                                        <Plus size={18} /> Provision Store
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="glass-card p-12 bg-white rounded-[40px] border border-gray-50 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                                            <Store className="text-black" size={32} />
                                        </div>
                                        <h3 className="text-xl font-black tracking-tight mb-2">Flagship Elite</h3>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Metropolis Hub</p>
                                        <div className="flex gap-4 w-full">
                                            <button className="flex-1 py-3 px-0 bg-gray-50 text-black text-[10px] uppercase font-black tracking-widest rounded-xl hover:bg-black hover:text-white transition-all shadow-none">View Catalog</button>
                                            <button className="flex-1 py-3 px-0 bg-red-50 text-red-600 text-[10px] uppercase font-black tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-none border-none">Decommission</button>
                                        </div>
                                    </div>
                                    <div className="glass-card p-12 bg-white/50 rounded-[40px] border border-dashed border-gray-100 flex flex-col items-center justify-center text-center h-[320px]">
                                        <p className="text-gray-300 font-bold uppercase tracking-[0.2em] text-[10px]">Awaiting Node Provisioning</p>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        <>
                            {activeTab === 'scan' && <InventorySelector key="scan" onAdd={handleAdd} addToast={addToast} storeId={user.storeId} />}
                            {activeTab === 'cart' && <CartView key="cart" cart={cart} onRemove={handleRemove} />}
                            {activeTab === 'history' && <HistoryView key="history" orders={orders} />}
                            {activeTab === 'pay' && (
                                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto space-y-16 text-left py-10">
                                    <div className="space-y-3">
                                        <h1 className="text-5xl font-black">Checkout</h1>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Settle your balance</p>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Customer Identifier</label>
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={checkoutDetails.name}
                                                onChange={e => setCheckoutDetails({ ...checkoutDetails, name: e.target.value })}
                                                className="bg-white border-2 border-gray-50 focus:border-black p-6 rounded-[24px]"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contact Anchor</label>
                                            <input
                                                type="text"
                                                placeholder="Mobile Number"
                                                value={checkoutDetails.mobile}
                                                onChange={e => setCheckoutDetails({ ...checkoutDetails, mobile: e.target.value })}
                                                className="bg-white border-2 border-gray-50 focus:border-black p-6 rounded-[24px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-16 border-t border-gray-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Due</p>
                                            <p className="text-4xl font-black">${cart?.totalAmount?.toFixed(2) || '0.00'}</p>
                                        </div>
                                        <button
                                            className="px-12 py-5 text-xs font-black uppercase tracking-[0.2em] rounded-3xl"
                                            disabled={!checkoutDetails.name || !checkoutDetails.mobile || cart?.totalAmount <= 0}
                                            onClick={handleCheckout}
                                        >
                                            Authorize
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                            {activeTab === 'admin' && (
                                <div className="max-w-5xl mx-auto py-10 px-6">
                                    <div className="flex justify-between items-end mb-16">
                                        <div>
                                            <h1 className="text-5xl font-black">Inventory Admin</h1>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">Manage Store Assets</p>
                                        </div>
                                        <button className="py-4 px-8 rounded-2xl flex items-center gap-3">
                                            <Plus size={18} /> New Product
                                        </button>
                                    </div>
                                    <div className="glass-card overflow-hidden border-none shadow-sm rounded-[48px]">
                                        <table className="w-full text-left bg-white">
                                            <thead className="bg-gray-50/50">
                                                <tr>
                                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</th>
                                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                                    <th className="px-10 py-10 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Valuation</th>
                                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {[1, 2, 3].map(i => (
                                                    <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                                                        <td className="px-10 py-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden" />
                                                                <div>
                                                                    <p className="font-black text-gray-900">Enterprise Unit {i}</p>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SN-00{i}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-8">
                                                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">General</span>
                                                        </td>
                                                        <td className="px-10 py-8 text-right font-black text-gray-900">$999.00</td>
                                                        <td className="px-10 py-8 text-right">
                                                            <button className="p-3 bg-gray-50 text-gray-400 hover:text-black rounded-xl shadow-none border-none">
                                                                <ChevronRight size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

function App() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('scan');
    const [cart, setCart] = useState(null);
    const [orders, setOrders] = useState([]);
    const [toast, setToast] = useState(null);
    const [checkoutDetails, setCheckoutDetails] = useState({ name: '', mobile: '' });

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    useEffect(() => {
        if (user && user.role !== 'SUPER_ADMIN') {
            fetchCart();
            fetchOrders();
        }
    }, [user, activeTab]);

    const addToast = (message, type = 'success') => setToast({ message, type });

    const fetchCart = async () => {
        if (!user || !user.storeId) return;
        try {
            const res = await axios.get(`/api/cart/${user.id}?storeId=${user.storeId}`);
            setCart(res.data);
        } catch (err) { }
    };

    const fetchOrders = async () => {
        if (!user || !user.storeId) return;
        try {
            const res = await axios.get(`/api/orders?storeId=${user.storeId}`);
            setOrders(res.data);
        } catch (err) { }
    };

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        addToast(`Welcome back, ${userData.username}`);
        setActiveTab(userData.role === 'SUPER_ADMIN' ? 'admin' : 'scan');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setCart(null);
        setOrders([]);
        addToast("Session Terminated");
    };

    const handleAdd = async (serialNumber) => {
        try {
            const res = await axios.post(`/api/cart/${user.id}/add?serialNumber=${serialNumber}&storeId=${user.storeId}`);
            setCart(res.data);
            addToast(`Acquired: ${serialNumber.split('-').pop()}`);
        } catch (err) {
            addToast(err.response?.data?.message || "Error", "error");
        }
    };

    const handleRemove = async (serialNumber) => {
        try {
            const res = await axios.delete(`/api/cart/${user.id}/remove?serialNumber=${serialNumber}&storeId=${user.storeId}`);
            setCart(res.data);
            addToast("Unit Released");
        } catch (err) { }
    };

    const handleCheckout = async () => {
        try {
            await axios.post(`/api/orders/checkout/${user.id}?customerName=${checkoutDetails.name}&customerMobile=${checkoutDetails.mobile}&storeId=${user.storeId}`);
            await fetchOrders();
            await fetchCart();
            addToast("Transaction Confirmed");
            setActiveTab('history');
            setCheckoutDetails({ name: '', mobile: '' });
        } catch (err) {
            addToast("Failed to authorize", "error");
        }
    };

    return (
        <BrowserRouter>
            <AnimatePresence>
                {toast && <Toast key="toast" {...toast} onClose={() => setToast(null)} />}
            </AnimatePresence>

            <Routes>
                <Route path="/login" element={!user ? <LoginView onLogin={handleLogin} /> : <Navigate to="/" />} />
                <Route path="/signup" element={!user ? <SignupView onSignup={() => addToast("Store Registered Successfully")} /> : <Navigate to="/" />} />
                <Route path="/" element={user ?
                    <MainApp
                        user={user}
                        handleLogout={handleLogout}
                        cart={cart}
                        orders={orders}
                        fetchCart={fetchCart}
                        fetchOrders={fetchOrders}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        handleAdd={handleAdd}
                        handleRemove={handleRemove}
                        handleCheckout={handleCheckout}
                        checkoutDetails={checkoutDetails}
                        setCheckoutDetails={setCheckoutDetails}
                        addToast={addToast}
                    /> :
                    <Navigate to="/login" />
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
