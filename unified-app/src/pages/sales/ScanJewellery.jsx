import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { JEWELLERY_DATA } from '../../data/mock';
import {
    Scan, Search, Package, IndianRupee,
    MessageSquare, ChevronDown, ChevronUp, CheckCircle2,
    Trash2, AlertCircle
} from 'lucide-react';

export default function ScanJewellery() {
    const location = useLocation();
    const navigate = useNavigate();
    const { customer, zone } = location.state || { customer: { id: 'CUST-304' }, zone: { name: 'Gold Zone' } };

    const [barcode, setBarcode] = useState('');
    const [scannedItems, setScannedItems] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    const handleScan = (e) => {
        e?.preventDefault();
        const item = JEWELLERY_DATA.find(j => j.barcode === barcode);
        if (item) {
            if (!scannedItems.find(i => i.barcode === barcode)) {
                setScannedItems([{ ...item, comment: '', id: Date.now() }, ...scannedItems]);
            }
            setBarcode('');
        } else {
            alert('Jewellery not found');
        }
    };

    const updateComment = (id, comment) => {
        setScannedItems(scannedItems.map(item =>
            item.id === id ? { ...item, comment } : item
        ));
    };

    const removeItem = (id) => {
        setScannedItems(scannedItems.filter(i => i.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto pb-24">
            {/* Header Info */}
            <div className="flex items-center justify-between mb-8 glass px-6 py-4 rounded-3xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Session</p>
                        <h3 className="text-xl font-bold">{customer.id} <span className="text-gray-600 font-normal ml-2">@ {zone.name}</span></h3>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Items Shown</p>
                    <p className="text-2xl font-bold text-gold">{scannedItems.length}</p>
                </div>
            </div>

            {/* Scanner Input */}
            <form onSubmit={handleScan} className="mb-10 relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Scan className="text-gold group-focus-within:animate-pulse" size={24} />
                </div>
                <input
                    type="text"
                    placeholder="Scan Barcode (JWL001 - JWL005) or Type..."
                    className="w-full bg-white/5 border border-white/10 rounded-[32px] py-6 pl-16 pr-32 text-xl font-medium focus:border-gold/50 focus:ring-4 focus:ring-gold/5 outline-none transition-all placeholder:text-gray-600"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value.toUpperCase())}
                />
                <button
                    type="submit"
                    className="absolute right-3 top-2 bottom-2 px-8 gold-gradient rounded-full text-black font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Add Item
                </button>
            </form>

            {/* Scanned Items List */}
            <div className="space-y-4">
                {scannedItems.length === 0 ? (
                    <div className="py-20 text-center glass rounded-[40px] border-dashed border-2 border-white/5">
                        <Search size={48} className="mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-500 font-medium">No items scanned yet.</p>
                        <p className="text-gray-600 text-sm">Start scanning jewellery tags to record interaction.</p>
                    </div>
                ) : (
                    scannedItems.map((item) => (
                        <div key={item.id} className="glass rounded-3xl overflow-hidden transition-all group border border-transparent hover:border-white/10">
                            <div
                                className={`p-6 flex items-center gap-6 cursor-pointer ${expandedId === item.id ? 'bg-white/5' : ''}`}
                                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            >
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-gold transition-colors">
                                    <Package size={28} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-lg">{item.name}</h4>
                                        <span className="px-2 py-0.5 bg-white/5 text-gray-500 text-[10px] font-bold rounded-full">{item.barcode}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><IndianRupee size={12} /> {item.price.toLocaleString()}</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                                        <span>{item.category}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    {expandedId === item.id ? <ChevronUp className="text-gold" /> : <ChevronDown className="text-gray-600" />}
                                </div>
                            </div>

                            {/* Expandable Comments Area */}
                            {expandedId === item.id && (
                                <div className="px-6 pb-6 pt-2 bg-white/5 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
                                        <MessageSquare size={14} className="text-gold/50" />
                                        Customer Feedback / Notes
                                    </div>
                                    <textarea
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-gold/30 outline-none transition-all min-h-[100px] placeholder:text-gray-700"
                                        placeholder="e.g. Likes the design but wants 18k gold instead of 22k..."
                                        value={item.comment}
                                        onChange={(e) => updateComment(item.id, e.target.value)}
                                    />
                                    {!item.comment && (
                                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-600 italic px-1">
                                            <AlertCircle size={10} /> No specific comments recorded for this item.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Action Bar */}
            {scannedItems.length > 0 && (
                <div className="fixed bottom-8 left-64 right-8 flex justify-center pointer-events-none">
                    <button
                        onClick={() => navigate('/sales/summary', { state: { scannedItems, customer, zone } })}
                        className="pointer-events-auto gold-gradient px-12 py-5 rounded-full text-black font-black text-lg shadow-[0_20px_40px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                        Review & End Session
                        <CheckCircle2 size={24} />
                    </button>
                </div>
            )}
        </div>
    );
}
