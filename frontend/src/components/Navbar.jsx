import React from 'react';
import { CheckCircle2, LogOut } from 'lucide-react';

const Navbar = ({ user, cart, activeTab, setActiveTab, handleLogout }) => (
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
);

export default Navbar;
