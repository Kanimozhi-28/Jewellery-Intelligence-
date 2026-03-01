import React from 'react';
import {
    Users, Trophy, Target, TrendingUp,
    Search, Filter, ChevronRight, UserCircle
} from 'lucide-react';

const TEAM_DATA = [
    { id: 'EMP001', name: 'John Doe', sessions: 142, conversion: 28.5, revenue: '₹1.2M', items: 542 },
    { id: 'EMP002', name: 'Jane Smith', sessions: 128, conversion: 22.1, revenue: '₹950k', items: 485 },
    { id: 'EMP003', name: 'Mike Ross', sessions: 98, conversion: 18.5, revenue: '₹720k', items: 320 },
    { id: 'EMP004', name: 'Sarah Connor', sessions: 156, conversion: 32.2, revenue: '₹1.8M', items: 610 },
];

export default function SalespersonPerformance() {
    const sortedTeam = [...TEAM_DATA].sort((a, b) => b.conversion - a.conversion);

    return (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tight mb-2 italic text-white flex items-center gap-4">
                    <Trophy className="text-gold" size={32} />
                    Sales Intelligence Team
                </h1>
                <p className="text-gray-500 font-medium italic underline decoration-gold/20 underline-offset-8">Efficiency & Conversion Leaderboard</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                <div className="lg:col-span-3 glass rounded-[40px] overflow-hidden border border-white/5">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                                <th className="px-8 py-6">Professional</th>
                                <th className="px-6 py-6 font-black italic">Sessions</th>
                                <th className="px-6 py-6 font-black italic">Avg. Items</th>
                                <th className="px-6 py-6 font-black italic text-right">Conversion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/2">
                            {sortedTeam.map((member, idx) => (
                                <tr key={member.id} className="group hover:bg-white/5 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-gray-600 italic border border-white/5">
                                                    {idx + 1}
                                                </div>
                                                {idx === 0 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-gold rounded-full flex items-center justify-center shadow-lg"><Trophy size={10} className="text-black" /></div>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg group-hover:text-gold transition-colors">{member.name}</p>
                                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">{member.id} • Senior Associate</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="text-lg font-black text-white">{member.sessions}</p>
                                        <p className="text-[10px] text-gray-700 font-bold italic">Interactions</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="text-lg font-black text-gray-400">{(member.items / member.sessions).toFixed(1)}</p>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="inline-flex flex-col items-end">
                                            <span className="text-xl font-black text-gold italic">{member.conversion}%</span>
                                            <div className="w-24 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                                                <div className="bg-gold h-full" style={{ width: `${member.conversion}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-6">
                    <div className="glass rounded-[32px] p-6 border-white/5 border shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gold/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Top Performer Revenue</p>
                        <h4 className="text-3xl font-black text-white italic mb-1">{sortedTeam[0].revenue}</h4>
                        <p className="text-xs text-gold/60 font-medium">Verified conversions today</p>
                    </div>

                    <div className="glass rounded-[32px] p-8 bg-gold/10 border-gold/20 border-2">
                        <h4 className="text-lg font-black italic mb-4">Sync Performance</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Target Reach</span>
                                <span className="font-black">84%</span>
                            </div>
                            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                <div className="bg-gold h-full w-[84%]"></div>
                            </div>
                            <p className="text-[10px] text-gray-500 italic leading-relaxed">System automatically maps POS sales to these interaction metrics using the loop-closure engine.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
