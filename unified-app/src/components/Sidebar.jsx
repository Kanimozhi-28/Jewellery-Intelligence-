import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Map, Settings,
    BarChart3, LogOut, Package, UserCircle,
    ChevronRight, Scan, History, EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-gold text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon size={20} />
        <span className="text-sm font-medium">{label}</span>
    </NavLink>
);

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminLinks = [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/jewellery', icon: Package, label: 'Jewellery' },
        { to: '/admin/sales-team', icon: Users, label: 'Sales Team' },
        { to: '/admin/zones', icon: Map, label: 'Store Zones' },
        { to: '/admin/lost-opps', icon: EyeOff, label: 'Lost Opps' },
        { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
        { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const salespersonLinks = [
        { to: '/sales/zones', icon: Map, label: 'Zone Selection' },
        { to: '/sales/customers', icon: Users, label: 'Live Customers' },
        { to: '/sales/scan', icon: Scan, label: 'Scan Jewellery' },
        { to: '/sales/summary', icon: History, label: 'Session Summary' },
    ];

    const links = user?.role === 'admin' ? adminLinks : salespersonLinks;

    return (
        <div className="w-64 h-screen border-r border-white/10 glass flex flex-col p-4 fixed left-0 top-0">
            <div className="flex items-center gap-2 px-4 py-8 mb-4">
                <div className="w-9 h-9 gold-gradient rounded-xl flex items-center justify-center font-bold text-black italic shadow-lg">JI</div>
                <span className="text-xl font-bold tracking-tight text-white">Intelligence</span>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
                {links.map(link => (
                    <NavItem key={link.to} {...link} />
                ))}
            </nav>

            <div className="pt-4 mt-4 border-t border-white/10">
                <div className="px-4 py-3 flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <UserCircle size={20} className="text-gray-400" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{user?.role}</p>
                        <p className="text-sm text-white font-bold truncate">{user?.name}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
                >
                    <LogOut size={20} />
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};
