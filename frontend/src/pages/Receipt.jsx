import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, CheckCircle, Package, CreditCard, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const Receipt = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReceipt();
    }, [orderId]);

    const fetchReceipt = async () => {
        try {
            const res = await axios.get(`/api/receipts/${orderId}`);
            setReceipt(res.data);
        } catch (err) {
            setError('Receipt not found');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Digital Receipt',
                text: `Receipt for Order #${orderId}`,
                url: window.location.href
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cred-black flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-cred-gold/20 border-t-cred-gold rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-cred-black flex flex-col items-center justify-center p-6">
                <Package size={64} className="text-cred-muted mb-4" />
                <p className="text-cred-muted text-lg">{error}</p>
                <button onClick={() => navigate('/')} className="btn-gold mt-6">
                    Go Home
                </button>
            </div>
        );
    }

    const receiptUrl = window.location.href;

    return (
        <div className="min-h-screen bg-cred-black py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto"
            >
                {/* Back Button - Hidden in print */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-cred-muted hover:text-white transition-colors mb-6 print:hidden"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Home</span>
                </button>

                {/* Receipt Card */}
                <div className="glass-card p-8 print:shadow-none print:border-0">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-green-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">Payment Successful</h1>
                        <p className="text-cred-muted text-sm">Thank you for your purchase!</p>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm">
                            <span className="text-cred-muted">Order ID</span>
                            <span className="text-white font-mono">#{receipt.orderId?.slice(-8)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-cred-muted">Date</span>
                            <span className="text-white">
                                {new Date(receipt.timestamp).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-cred-muted">Customer</span>
                            <span className="text-white">{receipt.customerName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-cred-muted">Mobile</span>
                            <span className="text-white">{receipt.customerMobile}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-cred-border my-6" />

                    {/* Items */}
                    <div className="space-y-3 mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-cred-muted mb-3">Items</h3>
                        {receipt.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <div className="flex-1">
                                    <p className="text-white">{item.productName}</p>
                                    <p className="text-cred-muted text-xs">SN: {item.serialNumber}</p>
                                </div>
                                <span className="text-white font-medium">${item.price?.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-cred-border my-6" />

                    {/* Totals */}
                    <div className="space-y-2 mb-6">
                        {receipt.subtotal > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-cred-muted">Subtotal</span>
                                <span className="text-white">${receipt.subtotal?.toFixed(2)}</span>
                            </div>
                        )}
                        {receipt.taxAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-cred-muted">Tax</span>
                                <span className="text-white">${receipt.taxAmount?.toFixed(2)}</span>
                            </div>
                        )}
                        {receipt.discountAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-cred-muted">Discount</span>
                                <span className="text-green-400">-${receipt.discountAmount?.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-cred-border">
                            <span className="text-white">Total</span>
                            <span className="text-cred-gold">${receipt.totalAmount?.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Method Badge */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <CreditCard size={16} className="text-cred-muted" />
                        <span className="text-cred-muted text-sm">
                            Paid via {receipt.paymentMethod || 'Card'}
                        </span>
                        {receipt.paymentId && (
                            <span className="text-cred-muted text-xs">
                                ({receipt.paymentId.slice(-8)})
                            </span>
                        )}
                    </div>

                    {/* QR Code */}
                    <div className="bg-white p-4 rounded-2xl w-fit mx-auto mb-6">
                        <QRCodeSVG
                            value={receiptUrl}
                            size={150}
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                    <p className="text-center text-cred-muted text-xs mb-6">
                        Scan to view digital receipt
                    </p>

                    {/* Action Buttons - Hidden in print */}
                    <div className="flex gap-3 print:hidden">
                        <button onClick={handlePrint} className="btn-dark flex-1 flex items-center justify-center gap-2">
                            <Download size={18} />
                            Print
                        </button>
                        <button onClick={handleShare} className="btn-gold flex-1 flex items-center justify-center gap-2">
                            <Share2 size={18} />
                            Share
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-cred-muted text-xs mt-6 print:hidden">
                    Powered by Scan & Bill
                </p>
            </motion.div>
        </div>
    );
};

export default Receipt;
