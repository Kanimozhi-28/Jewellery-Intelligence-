import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck } from 'lucide-react';

export default function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id && password) {
            const user = login(id, password);
            if (user.role === 'salesperson') {
                navigate('/zones');
            } else {
                alert('Unauthorized for Salesperson Portal');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-darker)' }}>
            <div className="w-full glass p-10" style={{ maxWidth: '28rem', borderRadius: '1.5rem', position: 'relative', borderTop: '2px solid rgba(212,175,55,0.3)' }}>
                <div className="flex flex-col items-center mb-10">
                    <div className="gold-gradient flex items-center justify-center font-bold italic mb-4" style={{ width: '80px', height: '80px', borderRadius: '1rem', fontSize: '1.875rem', color: 'black' }}>JI</div>
                    <h1 className="text-3xl font-black text-white italic">Sales Intelligence</h1>
                    <p className="text-gray-500 text-sm mt-2 font-medium">Sales Professional Access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-gray-500 font-black uppercase tracking-wider px-1" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>Employee ID</label>
                        <input
                            type="text"
                            placeholder="EMP-ID"
                            className="input-field"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-500 font-black uppercase tracking-wider px-1" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>Security Token</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary gold-gradient"
                    >
                        Authorize Access
                    </button>
                </form>
            </div>
        </div>
    );
}
