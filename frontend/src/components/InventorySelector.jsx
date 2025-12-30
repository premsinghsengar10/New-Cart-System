import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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

export default InventorySelector;
