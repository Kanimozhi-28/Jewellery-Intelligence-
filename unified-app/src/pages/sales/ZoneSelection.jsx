import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ZONES } from '../../data/mock';
import { ChevronRight, MapPin } from 'lucide-react';

export default function ZoneSelection() {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-2">Assign to Zone</h1>
                <p className="text-gray-400">Select your current duty area to see live customers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ZONES.map(zone => (
                    <div
                        key={zone.id}
                        onClick={() => navigate('/sales/customers', { state: { zone } })}
                        className="group cursor-pointer glass rounded-3xl p-8 hover:bg-white/10 transition-all active:scale-95 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 gold-gradient opacity-10 rounded-bl-[100px]"></div>

                        <div className="p-4 bg-white/5 rounded-2xl inline-block mb-6 group-hover:bg-gold/10 transition-colors">
                            <MapPin className="text-gold" size={28} />
                        </div>

                        <h2 className="text-2xl font-bold mb-1 text-white group-hover:text-gold transition-colors">{zone.name}</h2>
                        <p className="text-gray-500 text-sm mb-6">Floor {zone.floor}</p>

                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                                {zone.activeCount} Active Now
                            </span>
                            <ChevronRight size={20} className="text-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
