import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Package, ShoppingBag, ClipboardList,
    Plus, Trash2, LogOut, ArrowLeft, TrendingUp, DollarSign,
    Menu, X
} from 'lucide-react';
import Modal from '../components/Modal';

const AdminDashboard = ({ user, handleLogout, addToast, storeId, onBack }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const effectiveStoreId = storeId || user.storeId;

    const [productForm, setProductForm] = useState({
        barcode: '', name: '', price: '', category: 'Electronics', imageUrl: '',
        basePrice: '', initialStock: 10, taxRate: 18.0, costPrice: 0
    });
    const [inventoryForm, setInventoryForm] = useState({ barcode: '', quantity: 5 });

    useEffect(() => {
        if (effectiveStoreId) {
            fetchStats();
            fetchProducts();
            fetchOrders();
        }
    }, [effectiveStoreId]);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`/api/admin/stats?storeId=${effectiveStoreId}`);
            setStats(res.data);
        } catch (err) { }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`/api/products?storeId=${effectiveStoreId}`);
            setProducts(res.data);
        } catch (err) { }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`/api/admin/orders?storeId=${effectiveStoreId}`);
            setOrders(res.data);
        } catch (err) { }
    };

    const handleAddProduct = async () => {
        try {
            const payload = {
                ...productForm,
                price: parseFloat(productForm.price),
                basePrice: parseFloat(productForm.basePrice),
                taxRate: parseFloat(productForm.taxRate),
                costPrice: parseFloat(productForm.costPrice),
                storeId: effectiveStoreId
            };
            await axios.post(`/api/admin/products?initialStock=${productForm.initialStock}`, payload);
            addToast("Product Added Successfully");
            setShowProductModal(false);
            fetchProducts();
        } catch (err) {
            addToast("Failed to add product", "error");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm("Delete this product?")) return;
        try {
            await axios.delete(`/api/admin/products/${id}`);
            addToast("Product Deleted");
            fetchProducts();
        } catch (err) {
            addToast("Failed to delete", "error");
        }
    };

    const handleAddInventory = async () => {
        try {
            await axios.post(`/api/admin/inventory/add?barcode=${inventoryForm.barcode}&quantity=${inventoryForm.quantity}&storeId=${effectiveStoreId}`);
            addToast("Stock Added Successfully");
            setInventoryForm({ barcode: '', quantity: 5 });
        } catch (err) {
            addToast("Failed to add stock", "error");
        }
    };

    const navItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'products', icon: Package, label: 'Products' },
        { id: 'inventory', icon: ClipboardList, label: 'Inventory' },
        { id: 'orders', icon: ShoppingBag, label: 'Orders' },
    ];

    const handleNavClick = (id) => {
        setActiveTab(id);
        setSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-cred-black">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-cred-dark/95 backdrop-blur-xl border-b border-cred-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-cred-gold to-amber-600 rounded-xl flex items-center justify-center">
                        <Package size={18} className="text-black" />
                    </div>
                    <span className="font-bold text-white">Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-cred-muted">
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex w-72 h-screen bg-cred-dark border-r border-cred-border/50 flex-col p-6 sticky top-0">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-cred-gold to-amber-600 rounded-xl flex items-center justify-center">
                            <Package size={20} className="text-black" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                            <p className="text-xs text-cred-muted">{user.username}</p>
                        </div>
                    </div>

                    {onBack && (
                        <button onClick={onBack} className="flex items-center gap-4 px-4 py-3 rounded-xl text-cred-gold hover:bg-cred-card mb-4 w-full transition-colors">
                            <ArrowLeft size={20} />
                            <span>Back to Stores</span>
                        </button>
                    )}

                    <nav className="space-y-1">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full transition-all
                                    ${activeTab === item.id
                                        ? 'bg-gradient-to-r from-cred-gold/10 to-transparent text-cred-gold border-l-2 border-cred-gold'
                                        : 'text-cred-muted hover:bg-cred-card hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 z-30 bg-black/90 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            className="pt-20 px-4 space-y-2"
                        >
                            {onBack && (
                                <button onClick={onBack} className="flex items-center gap-4 px-4 py-4 rounded-xl text-cred-gold w-full">
                                    <ArrowLeft size={20} />
                                    <span>Back to Stores</span>
                                </button>
                            )}
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`flex items-center gap-4 px-4 py-4 rounded-xl w-full text-lg font-medium
                                        ${activeTab === item.id ? 'bg-cred-gold text-black' : 'text-white'}`}
                                >
                                    <item.icon size={24} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                            <div className="pt-6 border-t border-cred-border mt-4">
                                <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-4 rounded-xl text-red-400 w-full">
                                    <LogOut size={24} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">
                <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Dashboard</h1>
                                <p className="text-cred-muted text-sm">Real-time analytics</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="glass-card p-6 md:p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                                            <DollarSign size={24} className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-cred-muted text-sm">Total Revenue</p>
                                            <p className="text-2xl md:text-3xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-400 text-sm">
                                        <TrendingUp size={16} />
                                        <span>Active</span>
                                    </div>
                                </div>

                                <div className="glass-card p-6 md:p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cred-gold/5 rounded-full blur-3xl" />
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-cred-gold/10 rounded-xl flex items-center justify-center">
                                            <ShoppingBag size={24} className="text-cred-gold" />
                                        </div>
                                        <div>
                                            <p className="text-cred-muted text-sm">Total Orders</p>
                                            <p className="text-2xl md:text-3xl font-bold text-white">{stats.totalOrders}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-cred-gold text-sm">
                                        <TrendingUp size={16} />
                                        <span>Transactions</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Products</h1>
                                    <p className="text-cred-muted text-sm">Manage catalog</p>
                                </div>
                                <button onClick={() => setShowProductModal(true)} className="btn-gold flex items-center justify-center gap-2">
                                    <Plus size={18} /> Add Product
                                </button>
                            </div>

                            {/* Mobile Card View */}
                            <div className="space-y-3 lg:hidden">
                                {products.map(p => (
                                    <div key={p.id} className="glass-card p-4 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-cred-dark rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={p.imageUrl || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt={p.name} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white truncate">{p.name}</p>
                                            <p className="text-xs text-cred-muted">{p.barcode}</p>
                                            <p className="text-cred-gold font-bold mt-1">${p.price.toFixed(2)}</p>
                                        </div>
                                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-400">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block glass-card overflow-hidden p-0">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-cred-border">
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-cred-muted">Product</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-cred-muted">Category</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-cred-muted">Price</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-cred-muted">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p.id} className="border-b border-cred-border/30 hover:bg-cred-card/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-cred-dark rounded-xl overflow-hidden">
                                                            <img src={p.imageUrl || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt={p.name} />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-white">{p.name}</p>
                                                            <p className="text-xs text-cred-muted">{p.barcode}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4"><span className="badge-silver">{p.category}</span></td>
                                                <td className="px-6 py-4 text-right font-bold text-white">${p.price.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* Inventory Tab */}
                    {activeTab === 'inventory' && (
                        <motion.div key="inventory" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-xl">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Inventory</h1>
                                <p className="text-cred-muted text-sm">Add stock to products</p>
                            </div>

                            <div className="glass-card p-6 md:p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-cred-muted">Select Product</label>
                                    <select className="input-premium" value={inventoryForm.barcode} onChange={e => setInventoryForm({ ...inventoryForm, barcode: e.target.value })}>
                                        <option value="">Choose a product...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.barcode}>{p.name} ({p.barcode})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-cred-muted">Quantity</label>
                                    <input type="number" className="input-premium" value={inventoryForm.quantity} onChange={e => setInventoryForm({ ...inventoryForm, quantity: parseInt(e.target.value) })} min="1" />
                                </div>

                                <button onClick={handleAddInventory} disabled={!inventoryForm.barcode} className="btn-gold w-full disabled:opacity-50">
                                    Add Stock
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Orders</h1>
                                <p className="text-cred-muted text-sm">Transaction history</p>
                            </div>

                            {orders.length === 0 ? (
                                <div className="glass-card p-8 md:p-12 text-center">
                                    <ShoppingBag size={48} className="mx-auto text-cred-muted mb-4" />
                                    <p className="text-cred-muted">No orders yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map(order => (
                                        <div key={order.id} className="glass-card p-4 md:p-6 flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-semibold">{order.customerName}</p>
                                                <p className="text-cred-muted text-xs md:text-sm">{order.customerMobile} • {new Date(order.timestamp).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl md:text-2xl font-bold text-white">${order.totalAmount.toFixed(2)}</p>
                                                <span className="badge-gold text-xs">Paid</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Add Product Modal */}
            <Modal isOpen={showProductModal} onClose={() => setShowProductModal(false)} title="Add Product">
                <div className="space-y-4">
                    <input type="text" placeholder="Barcode" className="input-premium" value={productForm.barcode} onChange={e => setProductForm({ ...productForm, barcode: e.target.value })} />
                    <input type="text" placeholder="Product Name" className="input-premium" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Price ($)" className="input-premium" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                        <input type="number" placeholder="Cost ($)" className="input-premium" value={productForm.costPrice} onChange={e => setProductForm({ ...productForm, costPrice: e.target.value })} />
                    </div>
                    <input type="text" placeholder="Image URL" className="input-premium" value={productForm.imageUrl} onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })} />
                    <input type="number" placeholder="Initial Stock" className="input-premium" value={productForm.initialStock} onChange={e => setProductForm({ ...productForm, initialStock: e.target.value })} />
                    <button onClick={handleAddProduct} className="btn-gold w-full">Save Product</button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
