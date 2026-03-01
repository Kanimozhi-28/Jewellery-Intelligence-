import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, ChevronRight, UserCircle } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useAuth } from '../context/AuthContext';

export default function LiveCustomers() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const highlightId = searchParams.get('highlight');

    const { user } = useAuth();
    const { startSession } = useSession();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const zone = location.state?.zone || { id: 'gold', name: 'Gold Zone' };

    const DUMMY_CUSTOMERS = [
        {
            id: '8821',
            detected_at: new Date().toISOString(),
            zone_id: 'Gold Zone',
            photo: null,
            assigned_salesperson: 'Rajesh Kumar'
        },
        {
            id: '8822',
            detected_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
            zone_id: 'Gold Zone',
            photo: null,
            assigned_salesperson: null
        },
        {
            id: '8823',
            detected_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
            zone_id: 'Gold Zone',
            photo: null,
            assigned_salesperson: 'Anita Singh'
        },
        {
            id: '8824',
            detected_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
            zone_id: 'Diamond Zone',
            photo: null,
            assigned_salesperson: null
        }
    ];

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/operational/live-customers/${zone.id}?salesperson_id=${user?.id}`);
            const apiData = await response.json();

            // Combine real API data with dummy data for demonstration
            // Real data won't have 'assigned_salesperson' yet (backend pending), so they will show "Start Service"
            const combinedData = [...apiData, ...DUMMY_CUSTOMERS];

            setCustomers(combinedData);
        } catch (error) {
            console.error("Error fetching customers:", error);
            // Fallback to dummy data on error
            setCustomers(DUMMY_CUSTOMERS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
        const interval = setInterval(fetchCustomers, 5000);
        return () => clearInterval(interval);
    }, [zone.id]);

    const handleStartService = async (customer) => {
        try {
            await startSession(customer.id, user.id);
            navigate('/scan');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                @keyframes bloom {
                    0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); border-color: rgba(212, 175, 55, 0.9); }
                    70% { box-shadow: 0 0 20px 10px rgba(212, 175, 55, 0); border-color: rgba(212, 175, 55, 0.3); }
                    100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); border-color: rgba(212, 175, 55, 0.1); }
                }
                .card-bloom {
                    animation: bloom 2s infinite;
                    border: 2px solid var(--gold-primary) !important;
                }
            `}</style>
            <div className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 text-gold text-sm font-bold uppercase tracking-wider mb-2">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--gold-primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                        Live Monitoring: {zone.name}
                    </div>
                    <h1 className="text-3xl font-bold">Customers</h1>
                </div>
                <div className="flex gap-6">
                    <div className="flex flex-col items-center px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
                        <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Total</span>
                        <span className="text-2xl font-black text-white">{customers.length}</span>
                    </div>
                    <div className="flex flex-col items-center px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/30">
                        <span className="text-red-400 text-xs uppercase font-bold tracking-wider">Unassigned</span>
                        <span className="text-2xl font-black text-red-500">
                            {customers.filter(c => !c.assigned_salesperson).length}
                        </span>
                    </div>
                    <div className="flex flex-col items-center px-6 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/30">
                        <span className="text-orange-400 text-xs uppercase font-bold tracking-wider">Assigned</span>
                        <span className="text-2xl font-black text-orange-500">
                            {customers.filter(c => c.assigned_salesperson).length}
                        </span>
                    </div>
                </div>
            </div>

            {loading && customers.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-500 italic">
                    Initializing AI Watch...
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {customers.map(customer => {
                        const isHighlighted = customer.id === highlightId || (highlightId && customer.id === String(highlightId));
                        return (
                            <div key={customer.id} className={`glass p-6 flex items-center gap-6 shadow-xl ${isHighlighted ? 'card-bloom' : ''}`} style={{ borderRadius: '1.5rem', transition: 'all 0.2s', borderLeft: '4px solid transparent' }}>
                                <div className="flex items-center justify-center relative overflow-hidden" style={{ width: '80px', height: '80px', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)' }}>
                                    {customer.photo ? (
                                        <img
                                            src={customer.photo.startsWith('data:') ? customer.photo : `data:image/jpeg;base64,${customer.photo}`}
                                            alt="Customer Face"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserCircle size={40} className="text-gray-400" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold">{customer.id}</h3>
                                        <span className="px-1 py-0.5 text-green-500 font-bold rounded-full uppercase" style={{ background: 'rgba(34, 197, 94, 0.1)', fontSize: '10px' }}>AI Tracked</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                                        <div className="flex items-center gap-3">
                                            <Clock size={14} />
                                            Detected {new Date(customer.detected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="w-1 h-1 rounded-full" style={{ width: '4px', height: '4px', background: '#374151', borderRadius: '50%' }}></div>
                                        <span>Zone: {customer.zone_id}</span>
                                    </div>
                                </div>

                                {customer.assigned_salesperson ? (
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Assigned To</span>
                                        <span className="text-orange-500 font-black text-lg">{customer.assigned_salesperson}</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleStartService(customer)}
                                        className="btn-gold flex items-center gap-2"
                                        style={{ width: 'auto', padding: '0.75rem 1.5rem', fontSize: '14px', borderRadius: '1rem' }}
                                    >
                                        Start Service
                                        <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    {customers.length === 0 && (
                        <div className="p-10 text-center glass rounded-3xl text-gray-600">
                            No customers currently detected in this zone.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
