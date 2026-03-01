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
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    >
        <Icon size={20} />
        <span className="nav-label">{label}</span>
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
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/jewellery', icon: Package, label: 'Jewellery' },
        { to: '/sales-team', icon: Users, label: 'Sales Team' },
        { to: '/zones', icon: Map, label: 'Store Zones' },
        { to: '/lost-opps', icon: EyeOff, label: 'Lost Opps' },
        { to: '/reports', icon: BarChart3, label: 'Reports' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    const salespersonLinks = [
        { to: '/zones', icon: Map, label: 'Zone Selection' },
        { to: '/customers', icon: Users, label: 'Live Customers' },
        { to: '/scan', icon: Scan, label: 'Scan Jewellery' },
        { to: '/summary', icon: History, label: 'Session Summary' },
    ];

    const links = user?.role === 'admin' ? adminLinks : salespersonLinks;

    return (
        <div className="sidebar-container glass flex flex-col p-4">
            <div className="flex items-center gap-2 px-4 py-8 mb-4">
                <div className="w-9 h-9 gold-gradient rounded-xl flex items-center justify-center font-bold text-black italic shadow-lg" style={{ borderRadius: '12px', width: '36px', height: '36px' }}>JI</div>
                <span className="text-xl font-bold tracking-tight text-white" style={{ fontSize: '1.25rem' }}>Intelligence</span>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto pr-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {links.map(link => (
                    <NavItem key={link.to} {...link} />
                ))}
            </nav>

            <div className="pt-4 mt-4 border-t border-white/10" style={{ borderTop: '1px solid var(--border-glass)' }}>
                <div className="px-4 py-3 flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-glass)' }}>
                        <UserCircle size={20} className="text-gray-400" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-secondary font-medium uppercase tracking-wider" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role}</p>
                        <p className="text-sm text-white font-bold truncate" style={{ fontSize: '0.875rem' }}>{user?.name}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="logout-btn"
                >
                    <LogOut size={20} />
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};
