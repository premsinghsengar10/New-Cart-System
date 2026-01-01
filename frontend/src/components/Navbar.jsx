import React, { useState } from 'react';
import { Scan, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ user, cart, activeTab, setActiveTab, handleLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = user.role === 'SUPER_ADMIN'
        ? [{ id: 'admin', label: 'Ecosystem' }]
        : [
            { id: 'scan', label: 'Catalog' },
            { id: 'cart', label: `Cart (${cart?.items?.length || 0})` },
            { id: 'pay', label: 'Checkout' },
            { id: 'history', label: 'History' },
            ...(user.role === 'ADMIN' ? [{ id: 'admin', label: 'Admin' }] : [])
        ];

    const handleNavClick = (id) => {
        setActiveTab(id);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl bg-cred-card/95 backdrop-blur-xl border border-cred-border/50 rounded-2xl px-4 md:px-6 py-3 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-cred-gold to-amber-600 rounded-xl flex items-center justify-center">
                            <Scan size={16} className="text-black md:w-[18px] md:h-[18px]" />
                        </div>
                        <span className="font-bold text-base md:text-lg text-white tracking-tight">Scan & Bill</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                                    ${activeTab === item.id
                                        ? 'bg-cred-gold text-black'
                                        : 'text-cred-muted hover:text-white hover:bg-cred-border/50'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Desktop User Info */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-white">{user.username}</p>
                            <p className="text-xs text-cred-muted">{user.role}</p>
                        </div>
                        <button onClick={handleLogout} className="p-2.5 bg-cred-border/50 text-cred-muted hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-cred-muted hover:text-white"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl md:hidden"
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="pt-24 px-6 space-y-2"
                        >
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`w-full text-left px-6 py-4 rounded-2xl text-lg font-semibold transition-all
                                        ${activeTab === item.id
                                            ? 'bg-cred-gold text-black'
                                            : 'text-white hover:bg-cred-card'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}

                            <div className="pt-6 border-t border-cred-border mt-6">
                                <div className="flex items-center justify-between px-2 mb-4">
                                    <div>
                                        <p className="text-white font-semibold">{user.username}</p>
                                        <p className="text-cred-muted text-sm">{user.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-500/10 text-red-400 rounded-2xl font-semibold"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
