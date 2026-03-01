import React, { useState } from 'react';
import {
    Plus, Search, Filter, ArrowUpDown,
    MessageSquare, ChevronDown, ChevronUp, BarChart,
    Eye, ShoppingCart, Percent
} from 'lucide-react';
import { JEWELLERY_DATA } from '../../data/mock';

const MOCK_COMMENTS = [
    { session: 'SESS-102', user: 'EMP001', date: '2025-12-30', text: 'Customer felt the design was too heavy for daily wear.' },
    { session: 'SESS-105', user: 'EMP003', date: '2025-12-30', text: 'Requested 18k customization.' },
    { session: 'SESS-110', user: 'EMP002', date: '2025-12-31', text: 'Very interested, might return with spouse.' },
];

export default function JewelleryAnalytics() {
    const [expandedRow, setExpandedRow] = useState(null);

    const getStats = (barcode) => {
        // Mock analytics logic
        const viewed = Math.floor(Math.random() * 200) + 50;
        const sold = Math.floor(viewed * (Math.random() * 0.3));
        const conv = ((sold / viewed) * 100).toFixed(1);
        return { viewed, sold, conv };
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 italic">Jewellery Intelligence</h1>
                    <p className="text-gray-500 font-medium">Individual item performance & feedback</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input type="text" placeholder="Search item..." className="glass py-3 pl-12 pr-6 rounded-2xl text-sm outline-none focus:border-gold/30 transition-all w-64" />
                    </div>
                    <button className="gold-gradient p-3 rounded-2xl text-black shadow-lg hover:scale-105 transition-all"><Filter size={20} /></button>
                </div>
            </div>

            <div className="glass rounded-[40px] overflow-hidden border border-white/5">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            <th className="px-8 py-6">Item Identity</th>
                            <th className="px-6 py-6 text-center"><div className="flex items-center justify-center gap-2"><Eye size={12} /> Interacted</div></th>
                            <th className="px-6 py-6 text-center"><div className="flex items-center justify-center gap-2"><ShoppingCart size={12} /> Sold</div></th>
                            <th className="px-6 py-6 text-center"><div className="flex items-center justify-center gap-2"><Percent size={12} /> Conversion</div></th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {JEWELLERY_DATA.map((item) => {
                            const stats = getStats(item.barcode);
                            const isExpanded = expandedRow === item.barcode;

                            return (
                                <React.Fragment key={item.barcode}>
                                    <tr className={`group transition-colors ${isExpanded ? 'bg-white/5' : 'hover:bg-white/2'} `}>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 font-black italic">
                                                    {item.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg group-hover:text-gold transition-colors">{item.name}</p>
                                                    <p className="text-xs text-gray-600 font-bold uppercase">{item.barcode} • {item.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center text-xl font-black">{stats.viewed}</td>
                                        <td className="px-6 py-6 text-center text-xl font-black text-green-500">{stats.sold}</td>
                                        <td className="px-6 py-6 text-center">
                                            <span className={`px-4 py-2 rounded-full font-black text-sm bg-white/5 ${stats.conv > 15 ? 'text-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]' : 'text-gray-400'}`}>
                                                {stats.conv}%
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => setExpandedRow(isExpanded ? null : item.barcode)}
                                                className={`flex items-center gap-2 ml-auto py-2 px-4 rounded-xl text-xs font-bold transition-all ${isExpanded ? 'bg-gold text-black italic' : 'text-gray-500 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {isExpanded ? 'Hide Feed' : 'View Comments'}
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-4 bg-black/40">
                                                <div className="flex gap-8 items-start py-4">
                                                    <div className="flex-1 space-y-4">
                                                        <div className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-4">Latest Salesperson Observations</div>
                                                        {MOCK_COMMENTS.map((c, idx) => (
                                                            <div key={idx} className="glass border-white/5 p-4 rounded-2xl flex gap-4 items-start">
                                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                                    {c.user.slice(-2)}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-center mb-1">
                                                                        <p className="text-xs font-bold text-white">{c.user} <span className="text-gray-600 font-normal ml-2">via {c.session}</span></p>
                                                                        <p className="text-[10px] text-gray-700 font-bold">{c.date}</p>
                                                                    </div>
                                                                    <p className="text-sm text-gray-400 italic leading-relaxed font-medium">"{c.text}"</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="w-80 glass border-white/5 p-6 rounded-3xl">
                                                        <div className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-6">Retention Settings</div>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-gray-500">Auto-delete images in</span>
                                                                <span className="font-bold">4 days</span>
                                                            </div>
                                                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                                <div className="bg-gold h-full w-[60%]"></div>
                                                            </div>
                                                            <div className="text-[10px] text-gray-700 italic">This data is strictly anonymous and encrypted. No face data preserved.</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
