import React from 'react';
import { EyeOff, Ghost, ArrowRight, IndianRupee, MessageCircle, AlertCircle } from 'lucide-react';
import { JEWELLERY_DATA } from '../../data/mock';

export default function LostOpportunities() {
    // Sort items by viewed but not purchased gap
    const lostOpps = JEWELLERY_DATA.slice(0, 4).map(item => ({
        ...item,
        viewed: Math.floor(Math.random() * 50) + 10,
        purchased: Math.floor(Math.random() * 2),
        commonFeedback: "Design too heavy for 18k preference"
    }));

    return (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-700">
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 italic">Lost Opportunities</h1>
                    <p className="text-gray-500 font-medium">Items shown but results not converted • <span className="text-red-500/80 font-black italic">Loop Closure Gaps</span></p>
                </div>
                <div className="px-6 py-3 glass rounded-2xl flex items-center gap-2 border-red-500/10">
                    <AlertCircle size={18} className="text-red-500" />
                    <span className="text-xs font-black italic">14% Global Leakage</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {lostOpps.map((item) => (
                    <div key={item.barcode} className="glass rounded-[40px] p-8 flex items-center gap-10 hover:bg-white/10 transition-all border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-gray-700 group-hover:text-red-400 transition-colors">
                            <EyeOff size={40} />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-2xl font-black italic">{item.name}</h3>
                                <span className="px-3 py-1 bg-white/5 text-[10px] font-black text-gray-500 rounded-full italic">{item.barcode}</span>
                            </div>
                            <p className="text-sm text-gray-600 font-bold uppercase tracking-widest mb-4">Category: {item.category} • Value: ₹{item.price.toLocaleString()}</p>

                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-red-500/5 rounded-xl border border-red-500/10 flex items-center gap-2">
                                    <Ghost size={16} className="text-red-500/60" />
                                    <span className="text-sm font-black text-gray-400">Shown {item.viewed} times</span>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-xl flex items-center gap-2">
                                    <IndianRupee size={14} className="text-gold/50" />
                                    <span className="text-sm font-black text-white">Sold: {item.purchased}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-80 glass bg-black/40 p-6 rounded-3xl border-white/5">
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">
                                <MessageCircle size={14} className="text-gold/30" />
                                Dominant Feedback
                            </div>
                            <p className="text-xs text-gray-400 italic leading-relaxed font-medium">"{item.commonFeedback}"</p>
                            <button className="mt-4 text-[10px] font-black text-gold flex items-center gap-1 hover:underline underline-offset-4">
                                Analyze Drilldown <ArrowRight size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
