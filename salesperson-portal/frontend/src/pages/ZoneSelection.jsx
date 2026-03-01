import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ZONES } from '../data/mock';
import { ChevronRight, MapPin } from 'lucide-react';

export default function ZoneSelection() {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-2">Assign to Zone</h1>
                <p className="text-gray-400">Select your current duty area to see live customers</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {ZONES.map(zone => (
                    <div
                        key={zone.id}
                        onClick={() => navigate('/customers', { state: { zone } })}
                        className="glass p-8 relative overflow-hidden"
                        style={{ borderRadius: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <div className="absolute top-0 right-0 gold-gradient" style={{ width: '96px', height: '96px', opacity: 0.1, borderBottomLeftRadius: '100px' }}></div>

                        <div className="p-4 bg-white/5 rounded-2xl mb-6 flex items-center justify-center" style={{ display: 'inline-flex', width: 'auto' }}>
                            <MapPin className="text-gold" size={28} />
                        </div>

                        <h2 className="text-2xl font-bold mb-1 text-white">{zone.name}</h2>
                        <p className="text-gray-500 text-sm mb-6">Floor {zone.floor}</p>

                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                {zone.activeCount} Active Now
                            </span>
                            <ChevronRight size={20} className="text-gold" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
