import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
    Scan, Search, Package, IndianRupee,
    MessageSquare, ChevronDown, ChevronUp, CheckCircle2,
    Trash2, AlertCircle, Loader2, Camera
} from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function ScanJewellery() {
    const navigate = useNavigate();
    const { activeSession, scannedItems, scanJewellery, updateScanComment, loading, error, setError } = useSession();

    const [barcode, setBarcode] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [scannerActive, setScannerActive] = useState(false);
    const scannerRef = useRef(null);

    // Redirect if no session
    useEffect(() => {
        if (!activeSession) {
            // Check localStorage as fallback if context hasn't loaded yet
            const saved = localStorage.getItem('active_session');
            if (!saved) {
                // No session found
            }
        }
    }, [activeSession]);

    // Cleanup scanner on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
            }
        };
    }, []);

    const startScanner = () => {
        setScannerActive(true);
        setError(null);

        // Timeout to ensure div is rendered
        setTimeout(() => {
            const scanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            });

            scanner.render(onScanSuccess, onScanError);
            scannerRef.current = scanner;
        }, 100);
    };

    const stopScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
        }
        setScannerActive(false);
    };

    const onScanSuccess = async (decodedText) => {
        console.log("Scanned:", decodedText);
        stopScanner();
        try {
            await scanJewellery(decodedText);
        } catch (err) {
            // Error is handled by context but we can log here
        }
    };

    const onScanError = (err) => {
        // console.warn(err);
    };

    const handleManualSubmit = async (e) => {
        e?.preventDefault();
        if (!barcode) return;
        try {
            await scanJewellery(barcode);
            setBarcode('');
        } catch (err) {
            // Error handled by context
        }
    };

    if (!activeSession) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mb-6 text-gold border border-gold/20">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Start service before scanning</h2>
                <p className="text-gray-500 mb-8 max-w-sm">You need an active customer session to record jewellery interactions.</p>
                <button onClick={() => navigate('/customers')} className="btn-gold px-8 py-3 rounded-full">
                    Go to Live Customers
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto" style={{ paddingBottom: '8rem' }}>
            {/* Header Info */}
            <div className="flex items-center justify-between mb-8 glass px-6 py-4" style={{ borderRadius: '1.5rem' }}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center text-gold" style={{ width: '48px', height: '48px', background: 'rgba(212,175,55,0.1)', borderRadius: '1rem' }}>
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-tiny text-gray-500 font-bold uppercase tracking-wider">Active Session</p>
                        <h3 className="text-xl font-bold">
                            {activeSession.customer_id}
                            <span className="text-gold/60 text-sm font-medium ml-2">#{activeSession.id}</span>
                        </h3>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="text-tiny text-gray-500 font-bold uppercase tracking-wider">Items Shown</p>
                    <p className="text-2xl font-bold text-gold">{scannedItems.length}</p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} />
                    <span className="font-medium">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-sm font-bold uppercase">Dismiss</button>
                </div>
            )}

            {/* Scanner Controls */}
            <div className="mb-10">
                {!scannerActive ? (
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={startScanner}
                            className="w-full flex items-center justify-center gap-3 py-8 glass border-2 border-dashed border-gold/30 hover:border-gold/60 hover:bg-gold/5 transition-all text-gold rounded-[2.5rem]"
                        >
                            <Camera size={32} />
                            <span className="text-xl font-bold tracking-tight">Open Camera Scanner</span>
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="h-[1px] flex-1 bg-white/10"></div>
                            <span className="text-tiny text-gray-600 font-bold uppercase">OR</span>
                            <div className="h-[1px] flex-1 bg-white/10"></div>
                        </div>

                        <form onSubmit={handleManualSubmit} className="relative group flex items-center gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Enter Barcode manually (e.g. JWL001)..."
                                    className="input-field w-full"
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value.toUpperCase())}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !barcode}
                                className="btn-gold h-[54px] px-8 rounded-2xl flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        <span>Add Item</span>
                                        <Package size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="glass overflow-hidden" style={{ borderRadius: '2.5rem' }}>
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
                            <h4 className="font-bold flex items-center gap-2">
                                <Scan size={18} className="text-gold" />
                                Align barcode within frame
                            </h4>
                            <button onClick={stopScanner} className="text-xs font-bold uppercase text-gray-500 hover:text-white">Cancel</button>
                        </div>
                        <div id="reader" style={{ width: '100%', minHeight: '300px' }}></div>
                    </div>
                )}
            </div>

            {/* Scanned Items List */}
            <div className="flex flex-col gap-4">
                <h3 className="text-tiny font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">Interaction History</h3>
                {scannedItems.length === 0 ? (
                    <div className="glass text-center" style={{ padding: '4rem', borderRadius: '2.5rem', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.05)' }}>
                        <Search size={40} className="mx-auto text-gray-700" style={{ marginBottom: '1rem' }} />
                        <p className="text-gray-500 font-medium italic">No items scanned in this session yet.</p>
                    </div>
                ) : (
                    scannedItems.map((item) => (
                        <div key={item.id} className="glass overflow-hidden" style={{ borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <div
                                className="p-5 flex items-center gap-5"
                                style={{ cursor: 'pointer', background: expandedId === item.id ? 'rgba(255,255,255,0.04)' : 'transparent' }}
                                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            >
                                <div className="flex items-center justify-center text-gold/60" style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.04)', borderRadius: '1rem' }}>
                                    <Package size={26} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-base">{item.name}</h4>
                                        <span className="px-2 py-0.5 text-gray-500 font-bold rounded-full" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '9px' }}>{item.barcode}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                        <span className="flex items-center gap-1 text-gold"><IndianRupee size={12} /> {item.price.toLocaleString()}</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                                        <span className="text-xs">{new Date(item.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                                <div>
                                    {expandedId === item.id ? <ChevronUp className="text-gold" /> : <ChevronDown className="text-gray-600" />}
                                </div>
                            </div>

                            {/* Expandable Comments */}
                            {expandedId === item.id && (
                                <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="flex items-center gap-2 mb-3 text-tiny font-bold text-gray-600 uppercase tracking-widest px-1">
                                        <MessageSquare size={13} />
                                        Interaction Notes
                                    </div>
                                    <textarea
                                        className="input-field w-full text-sm"
                                        style={{ background: 'rgba(0,0,0,0.3)', minHeight: '80px', borderRadius: '1rem' }}
                                        placeholder="Add notes about customer's interest..."
                                        value={item.comment || ''}
                                        onChange={(e) => updateScanComment(item.id, e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Action Bar */}
            {scannedItems.length > 0 && (
                <div className="fixed bottom-8 left-64 right-0 flex justify-center pointer-events-none z-50 px-8">
                    <button
                        onClick={() => navigate('/summary')}
                        className="btn-gold pointer-events-auto"
                        style={{ width: 'auto', padding: '1rem 3rem', borderRadius: '3rem', fontSize: '1rem', fontWeight: 900, boxShadow: '0 20px 40px rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                    >
                        Review Session
                        <CheckCircle2 size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
