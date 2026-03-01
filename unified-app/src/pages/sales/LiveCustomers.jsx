import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MOCK_CUSTOMERS } from '../../data/mock';
import { User, Clock, ChevronRight, UserCircle } from 'lucide-react';

export default function LiveCustomers() {
    const location = useLocation();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
    const zone = location.state?.zone || { name: 'Gold Zone' };

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Logic for new customer could go here
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleStartService = (customer) => {
        navigate('/sales/scan', { state: { customer, zone } });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 text-gold text-sm font-bold uppercase tracking-widest mb-2">
                        <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                        Live Monitoring: {zone.name}
                    </div>
                    <h1 className="text-3xl font-bold">Anonymous Customers</h1>
                </div>
                <p className="text-gray-500 text-sm mb-1">{customers.length} People Detected</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {customers.map(customer => (
                    <div key={customer.id} className="glass rounded-3xl p-6 flex items-center gap-6 hover:bg-white/10 transition-all border-l-4 border-l-transparent hover:border-l-gold group shadow-xl hover:shadow-gold/5">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                            <UserCircle size={40} className="text-gray-700" />
                            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold">{customer.id}</h3>
                                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase">Verified Match</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-500 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    Detected {customer.detectedAt}
                                </div>
                                <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                                <span>Interest: Rings, Bracelets</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleStartService(customer)}
                            className="px-6 py-3 gold-gradient rounded-2xl text-black font-bold text-sm shadow-xl hover:shadow-gold/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            Start Service
                            <ChevronRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
