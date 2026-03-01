import React from 'react';
import { Map, Users, TrendingUp, IndianRupee, Clock, ArrowRight } from 'lucide-react';
import { ZONES } from '../../data/mock';

export default function ZoneAnalytics() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tight mb-2 italic">Store Topography</h1>
                <p className="text-gray-500 font-medium">Zone-wise traffic flow and revenue density</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ZONES.map(zone => (
                    <div key={zone.id} className="glass rounded-[40px] p-8 border border-white/5 relative group hover:bg-white/10 transition-all cursor-pointer">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-[100px]" style={{ backgroundColor: zone.color }}></div>

                        <div className="flex justify-between items-start mb-8">
                            <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                                <Map size={28} style={{ color: zone.color }} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Floor</p>
                                <p className="text-xl font-bold font-serif italic text-white">{zone.floor}</p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black mb-1 group-hover:text-gold transition-colors">{zone.name}</h3>
                        <p className="text-sm text-gray-600 font-medium italic mb-10">High Demand Area • {zone.activeCount * 3} Daily Visitors</p>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Interaction Rate</p>
                                <p className="text-xl font-black flex items-center gap-1">84% <TrendingUp size={14} className="text-green-500" /></p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Revenue Heat</p>
                                <p className="text-xl font-black text-gold">High</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex gap-4">
                            <div className="flex items-center gap-2 opacity-60">
                                <Users size={16} />
                                <span className="text-xs font-bold">{zone.activeCount} Live</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-60 ml-auto group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-black uppercase text-gold">View Heatmap</span>
                                <ArrowRight size={14} className="text-gold" />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Zone Placeholder */}
                <div className="rounded-[40px] p-8 border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-gray-700 hover:border-gold/20 hover:text-gold/40 transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Map size={24} />
                    </div>
                    <p className="font-black italic text-sm">Configure New Store Zone</p>
                </div>
            </div>
        </div>
    );
}
