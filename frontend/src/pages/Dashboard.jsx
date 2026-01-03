import React, { useState, useEffect } from 'react';
import { Store, Plus, Search, ShoppingCart, Package, ArrowRight, ArrowLeft, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import AdminDashboard from './AdminDashboard';

// Product Detail Modal - Shows available inventory
const ProductDetailView = ({ product, storeId, onAdd, onClose, addToast }) => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, [product]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            // Using correct backend endpoint: /api/products/{barcode}/units
            const res = await axios.get(`/api/products/${product.barcode}/units?storeId=${storeId}`);
            setInventory(res.data.filter(i => i.status === 'AVAILABLE'));
        } catch (err) {
            console.error('Failed to fetch inventory:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (serialNumber) => {
        setAdding(serialNumber);
        try {
            await onAdd(serialNumber);
            addToast(`${product.name} added to cart`);
            onClose();
        } catch (err) {
            addToast("Failed to add item", "error");
        } finally {
            setAdding(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl overflow-y-auto"
        >
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <button onClick={onClose} className="flex items-center gap-2 text-cred-muted hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                            <span>Back to Catalog</span>
                        </button>
                        <button onClick={onClose} className="p-2 text-cred-muted hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Product Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="aspect-square bg-cred-card rounded-3xl overflow-hidden">
                            <img
                                src={product.imageUrl || 'https://via.placeholder.com/400'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="badge-silver mb-4 w-fit">{product.category}</span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
                            <p className="text-cred-muted mb-4">Barcode: {product.barcode}</p>
                            <p className="text-4xl font-bold text-cred-gold mb-6">${product.price.toFixed(2)}</p>
                            <div className="flex items-center gap-2 text-cred-muted">
                                <Package size={18} />
                                <span>{inventory.length} units available</span>
                            </div>
                        </div>
                    </div>

                    {/* Available Units */}
                    <div className="glass-card p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Select a Unit</h2>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-2 border-cred-gold/20 border-t-cred-gold rounded-full animate-spin" />
                            </div>
                        ) : inventory.length === 0 ? (
                            <div className="text-center py-12">
                                <Package size={48} className="mx-auto text-cred-muted mb-4" />
                                <p className="text-cred-muted">No units currently available</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {inventory.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleAddToCart(item.serialNumber)}
                                        disabled={adding === item.serialNumber}
                                        className={`p-4 rounded-2xl border-2 transition-all
                                            ${adding === item.serialNumber
                                                ? 'bg-cred-gold border-cred-gold'
                                                : 'bg-cred-dark border-cred-border hover:border-cred-gold/50 hover:bg-cred-card'
                                            }`}
                                    >
                                        {adding === item.serialNumber ? (
                                            <Check size={20} className="mx-auto text-black" />
                                        ) : (
                                            <>
                                                <p className="text-xs text-cred-muted mb-1">Unit</p>
                                                <p className="font-bold text-white">#{item.serialNumber.split('-').pop()}</p>
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Catalog View - Product Grid
const CatalogView = ({ storeId, onAdd, addToast }) => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [storeId]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/products?storeId=${storeId}`);
            setProducts(res.data);
        } catch (err) { }
        finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-cred-muted" size={20} />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="input-premium pl-14 text-center"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-cred-gold/20 border-t-cred-gold rounded-full animate-spin" />
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                    <Package size={64} className="mx-auto text-cred-muted mb-4" />
                    <p className="text-cred-muted text-lg">No products found</p>
                </div>
            ) : (
                /* Product Grid - Responsive */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {filteredProducts.map(product => (
                        <motion.div
                            key={product.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedProduct(product)}
                            className="glass-card p-3 md:p-4 cursor-pointer group"
                        >
                            <div className="aspect-square bg-cred-dark rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4">
                                <img
                                    src={product.imageUrl || 'https://via.placeholder.com/200'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="font-semibold text-white text-sm md:text-base truncate">{product.name}</h3>
                            <p className="text-cred-gold font-bold text-lg">${product.price.toFixed(2)}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <ProductDetailView
                        product={selectedProduct}
                        storeId={storeId}
                        onAdd={onAdd}
                        onClose={() => setSelectedProduct(null)}
                        addToast={addToast}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Cart View
const CartView = ({ cart, onRemove, goBack }) => (
    <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={goBack} className="flex items-center gap-2 text-cred-muted hover:text-white transition-colors mb-4">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Catalog</span>
        </button>
        <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Your Cart</h1>
            <span className="badge-gold">{cart?.items?.length || 0} items</span>
        </div>

        {!cart?.items?.length ? (
            <div className="glass-card p-8 md:p-12 text-center">
                <ShoppingCart size={48} className="mx-auto text-cred-muted mb-4" />
                <p className="text-cred-muted">Your cart is empty</p>
            </div>
        ) : (
            <>
                <div className="space-y-3">
                    {cart.items.map(item => (
                        <div key={item.serialNumber} className="glass-card p-3 md:p-4 flex items-center gap-3 md:gap-4">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-cred-dark rounded-xl overflow-hidden flex-shrink-0">
                                <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white text-sm md:text-base truncate">{item.productName}</p>
                                <p className="text-xs text-cred-muted">SN: {item.serialNumber}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-cred-gold font-bold">${item.price.toFixed(2)}</p>
                                <button onClick={() => onRemove(item.serialNumber)} className="text-red-400 hover:text-red-300 text-xs mt-1">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="glass-card p-4 md:p-6 flex items-center justify-between">
                    <span className="text-cred-muted">Total</span>
                    <span className="text-2xl md:text-3xl font-bold text-white">${cart.totalAmount.toFixed(2)}</span>
                </div>
            </>
        )}
    </div>
);

// History View
const HistoryView = ({ orders, goBack }) => (
    <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={goBack} className="flex items-center gap-2 text-cred-muted hover:text-white transition-colors mb-4">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Catalog</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Order History</h1>
        {orders.length === 0 ? (
            <div className="glass-card p-8 md:p-12 text-center">
                <Package size={48} className="mx-auto text-cred-muted mb-4" />
                <p className="text-cred-muted">No orders yet</p>
            </div>
        ) : (
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="glass-card p-4 md:p-6 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-white">{order.customerName}</p>
                            <p className="text-xs text-cred-muted">{new Date(order.timestamp).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg md:text-xl font-bold text-white">${order.totalAmount.toFixed(2)}</p>
                            <span className="badge-gold text-xs">Completed</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

// Checkout View
const CheckoutView = ({ cart, checkoutDetails, setCheckoutDetails, handleCheckout, goBack }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto space-y-6"
    >
        <button onClick={goBack} className="flex items-center gap-2 text-cred-muted hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Cart</span>
        </button>
        <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Checkout</h1>
            <p className="text-cred-muted text-sm">Complete your purchase</p>
        </div>

        <div className="glass-card p-6 md:p-8 space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cred-muted">Customer Name</label>
                <input
                    type="text"
                    placeholder="Full name"
                    className="input-premium"
                    value={checkoutDetails.name}
                    onChange={e => setCheckoutDetails({ ...checkoutDetails, name: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cred-muted">Mobile Number</label>
                <input
                    type="text"
                    placeholder="Phone number"
                    className="input-premium"
                    value={checkoutDetails.mobile}
                    onChange={e => setCheckoutDetails({ ...checkoutDetails, mobile: e.target.value })}
                />
            </div>

            <div className="pt-6 border-t border-cred-border">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-cred-muted">Total Amount</span>
                    <span className="text-2xl md:text-3xl font-bold text-white">${cart?.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <button
                    onClick={handleCheckout}
                    disabled={!checkoutDetails.name || !checkoutDetails.mobile || !cart?.totalAmount}
                    className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Complete Payment
                </button>
            </div>
        </div>
    </motion.div>
);

// Main Dashboard
const Dashboard = ({ user, handleLogout, cart, orders, fetchCart, fetchOrders, activeTab, setActiveTab, handleAdd, handleRemove, handleCheckout, checkoutDetails, setCheckoutDetails, addToast }) => {
    const [stores, setStores] = useState([]);
    const [showStoreModal, setShowStoreModal] = useState(false);
    const [storeForm, setStoreForm] = useState({ name: '', location: '', adminUsername: '', adminPassword: '' });
    const [selectedStoreId, setSelectedStoreId] = useState(null);

    useEffect(() => {
        if (user.role === 'SUPER_ADMIN' && activeTab === 'admin') {
            fetchStores();
        }
    }, [user, activeTab]);

    const fetchStores = async () => {
        try {
            const res = await axios.get('/api/auth/stores');
            setStores(res.data);
        } catch (err) { }
    };

    const handleCreateStore = async () => {
        try {
            await axios.post('/api/auth/register-store', storeForm);
            addToast("Store Created Successfully");
            setShowStoreModal(false);
            setStoreForm({ name: '', location: '', adminUsername: '', adminPassword: '' });
            fetchStores();
        } catch (err) {
            addToast("Failed to create store", "error");
        }
    };

    return (
        <div className="min-h-screen bg-cred-black">
            <Navbar
                user={user}
                cart={cart}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                    setActiveTab(tab);
                    if (tab === 'admin') setSelectedStoreId(null);
                }}
                handleLogout={handleLogout}
            />

            <main className="pt-24 md:pt-28 pb-8 md:pb-12 px-4 md:px-6 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {user.role === 'SUPER_ADMIN' ? (
                        activeTab === 'admin' && (
                            selectedStoreId ? (
                                <AdminDashboard
                                    user={user}
                                    storeId={selectedStoreId}
                                    onBack={() => setSelectedStoreId(null)}
                                    handleLogout={handleLogout}
                                    addToast={addToast}
                                />
                            ) : (
                                <motion.div
                                    key="ecosystem"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6 md:space-y-8"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <h1 className="text-2xl md:text-3xl font-bold text-white">Store Ecosystem</h1>
                                            <p className="text-cred-muted text-sm">Manage your store network</p>
                                        </div>
                                        <button onClick={() => setShowStoreModal(true)} className="btn-gold flex items-center justify-center gap-2">
                                            <Plus size={18} /> Add Store
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                        {stores.map(store => (
                                            <div key={store.id} className="glass-card p-6 md:p-8 text-center">
                                                <div className="w-14 h-14 md:w-16 md:h-16 bg-cred-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                                                    <Store size={28} className="text-cred-gold" />
                                                </div>
                                                <h3 className="text-lg md:text-xl font-bold text-white mb-1">{store.name}</h3>
                                                <p className="text-cred-muted text-sm mb-4 md:mb-6">{store.location}</p>
                                                <button
                                                    onClick={() => setSelectedStoreId(store.id)}
                                                    className="btn-dark w-full flex items-center justify-center gap-2"
                                                >
                                                    Manage <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        ))}

                                        <div
                                            onClick={() => setShowStoreModal(true)}
                                            className="glass-card p-6 md:p-8 border-dashed border-2 border-cred-border flex flex-col items-center justify-center cursor-pointer hover:border-cred-gold/50 transition-colors min-h-[200px]"
                                        >
                                            <Plus size={40} className="text-cred-muted mb-4" />
                                            <p className="text-cred-muted">Add New Store</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        )
                    ) : (
                        <>
                            {activeTab === 'scan' && (
                                <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <CatalogView storeId={user.storeId} onAdd={handleAdd} addToast={addToast} />
                                </motion.div>
                            )}
                            {activeTab === 'cart' && (
                                <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <CartView cart={cart} onRemove={handleRemove} goBack={() => setActiveTab('scan')} />
                                </motion.div>
                            )}
                            {activeTab === 'history' && (
                                <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <HistoryView orders={orders} goBack={() => setActiveTab('scan')} />
                                </motion.div>
                            )}
                            {activeTab === 'pay' && (
                                <CheckoutView
                                    cart={cart}
                                    checkoutDetails={checkoutDetails}
                                    setCheckoutDetails={setCheckoutDetails}
                                    handleCheckout={handleCheckout}
                                    goBack={() => setActiveTab('cart')}
                                />
                            )}
                            {activeTab === 'admin' && user.role === 'ADMIN' && (
                                <AdminDashboard user={user} handleLogout={handleLogout} addToast={addToast} />
                            )}
                        </>
                    )}
                </AnimatePresence>
            </main>

            {/* Create Store Modal */}
            <Modal isOpen={showStoreModal} onClose={() => setShowStoreModal(false)} title="Create Store">
                <div className="space-y-4">
                    <input type="text" placeholder="Store Name" className="input-premium" value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} />
                    <input type="text" placeholder="Location" className="input-premium" value={storeForm.location} onChange={e => setStoreForm({ ...storeForm, location: e.target.value })} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" placeholder="Admin Username" className="input-premium" value={storeForm.adminUsername} onChange={e => setStoreForm({ ...storeForm, adminUsername: e.target.value })} />
                        <input type="password" placeholder="Admin Password" className="input-premium" value={storeForm.adminPassword} onChange={e => setStoreForm({ ...storeForm, adminPassword: e.target.value })} />
                    </div>
                    <button onClick={handleCreateStore} className="btn-gold w-full">Create Store</button>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
