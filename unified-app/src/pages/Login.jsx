import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

export default function Login() {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (employeeId && password) {
            const user = login(employeeId, password);
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/sales/zones');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#050505] p-6">
            <div className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 gold-gradient opacity-50"></div>

                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 gold-gradient rounded-2xl flex items-center justify-center font-bold text-3xl text-black italic shadow-[0_0_30px_rgba(212,175,55,0.2)] mb-6 transition-transform group-hover:scale-110 duration-500">JI</div>
                    <h1 className="text-3xl font-bold text-white mb-2 italic">Intelligence Portal</h1>
                    <p className="text-gray-500 text-sm">Enter credentials to assist customers</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest px-1">Employee ID</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                            <input
                                type="text"
                                placeholder="EMP001 (Sales) or ADMIN (Admin)"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest px-1">Security Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full gold-gradient py-4 rounded-2xl text-black font-bold text-lg shadow-[0_10px_20px_rgba(212,175,55,0.15)] hover:shadow-[0_15px_30px_rgba(212,175,55,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                        Authorize Access
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-xs uppercase tracking-tighter">Privacy-First Customer Intelligence System</p>
                </div>
            </div>
        </div>
    );
}
