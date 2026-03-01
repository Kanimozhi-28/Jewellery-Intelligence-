import React from 'react';
import { Settings, FileText, Download, ShieldCheck, Database, Layout } from 'lucide-react';

export default function AdminSettings() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tight mb-2 italic">Control Center</h1>
                <p className="text-gray-500 font-medium italic underline decoration-gold/20 underline-offset-8">System Configuration & Data Policy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Settings Column */}
                <div className="space-y-6">
                    <div className="glass rounded-[40px] p-8 border border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                            <ShieldCheck size={24} className="text-gold" />
                            <h3 className="text-xl font-bold italic">Privacy Guard Settings</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center group">
                                <div>
                                    <p className="text-sm font-bold">Automatic Image Purge</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">MinIO Lifecycle Policy</p>
                                </div>
                                <span className="bg-gold text-black px-4 py-1.5 rounded-full text-[10px] font-black italic">Active: 7 Days</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <div>
                                    <p className="text-sm font-bold">Face Blur / Anonymization</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">CV Pipeline Masking</p>
                                </div>
                                <div className="w-10 h-5 bg-gold/20 rounded-full p-1 relative cursor-pointer"><div className="w-3 h-3 bg-gold rounded-full float-right"></div></div>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-[40px] p-8 border border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                            <Database size={24} className="text-gold" />
                            <h3 className="text-xl font-bold italic">Data Sources</h3>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5">
                            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                            </div>
                            <div>
                                <p className="text-sm font-bold">POS Integration Status</p>
                                <p className="text-xs text-gray-500">Connected to Store-Central-v4</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reports Column */}
                <div className="glass rounded-[40px] p-8 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="p-10 bg-white/5 rounded-full mb-8 relative">
                        <FileText size={64} className="text-white/20" />
                        <div className="absolute top-0 right-0 w-8 h-8 gold-gradient rounded-full flex items-center justify-center text-black shadow-xl"><Download size={14} /></div>
                    </div>
                    <h3 className="text-2xl font-black mb-2 italic">Monthly conversion_summary_dec.pdf</h3>
                    <p className="text-sm text-gray-500 mb-8 max-w-xs">Full analytics breakdown of jewellery interest vs final purchase conversion for the month of December.</p>
                    <button className="gold-gradient w-full py-5 rounded-3xl text-black font-black italic flex items-center justify-center gap-3 hover:scale-[1.02] shadow-xl transition-all">
                        Generate Final Report
                    </button>
                </div>
            </div>
        </div>
    );
}
