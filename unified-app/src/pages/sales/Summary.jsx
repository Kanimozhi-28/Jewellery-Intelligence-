import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle, ArrowLeft, Clock, Package,
    IndianRupee, MessageCircle, ArrowRight
} from 'lucide-react';

export default function Summary() {
    const location = useLocation();
    const navigate = useNavigate();
    const { scannedItems, customer, zone } = location.state || { scannedItems: [], customer: {}, zone: {} };

    const totalValue = scannedItems.reduce((acc, item) => acc + item.price, 0);

    const handleFinish = () => {
        alert('Session Synchronized with Central Server');
        navigate('/sales/zones');
    };

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="flex flex-col items-center text-center mb-12">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-500/20">
                    <CheckCircle size={40} />
                </div>
                <h1 className="text-4xl font-bold mb-2">Session Review</h1>
                <p className="text-gray-400">Please verify the interaction details before submission</p>
            </div>

            {/* Summary Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="glass rounded-3xl p-6 text-center">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Customer</p>
                    <p className="text-xl font-bold">{customer.id}</p>
                </div>
                <div className="glass rounded-3xl p-6 text-center border-t-2 border-t-gold">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Items</p>
                    <p className="text-xl font-bold">{scannedItems.length}</p>
                </div>
                <div className="glass rounded-3xl p-6 text-center">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Est. Value</p>
                    <p className="text-xl font-bold">₹{(totalValue / 1000).toFixed(1)}k</p>
                </div>
            </div>

            <div className="space-y-6 mb-12">
                <h3 className="text-xl font-bold px-2 flex items-center gap-2">
                    <Package className="text-gold" size={20} />
                    Items Shown Detail
                </h3>

                {scannedItems.map((item, index) => (
                    <div key={item.id} className="glass rounded-3xl p-6 relative group border border-white/5 transition-all hover:bg-white/10">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-12 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                    <span className="text-gold/80">{item.barcode}</span>
                                    <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                                    <span>{item.category}</span>
                                    <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                                    <span className="flex items-center gap-1 text-white">₹{item.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/30 rounded-2xl p-4 flex gap-3 border border-white/5">
                            <MessageCircle size={18} className="text-gold/40 shrink-0 mt-1" />
                            <p className="text-sm text-gray-400 italic font-medium leading-relaxed">
                                {item.comment || "No specific feedback provided during the session."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Final Actions */}
            <div className="flex gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex-1 glass py-5 rounded-3xl text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={20} />
                    Go Back
                </button>
                <button
                    onClick={handleFinish}
                    className="flex-[2] gold-gradient py-5 rounded-3xl text-black font-black text-xl shadow-[0_15px_35px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    Confirm & End Session
                    <ArrowRight size={24} />
                </button>
            </div>
        </div>
    );
}
