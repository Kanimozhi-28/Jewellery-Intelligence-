import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Contact, BarChart, Settings, LogOut, Lock, Cctv, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/integrations', icon: Cctv, label: 'Integrations' },
    { path: '/cre', icon: Sparkles, label: 'CRE Dashboard' },
    { path: '/salesmen', icon: Users, label: 'Manager View' },
    { path: '/customers', icon: Contact, label: 'Customers' },
    { path: '/reports', icon: BarChart, label: 'Reports' },
    { path: '/ai-hotlead', icon: Sparkles, label: 'AI Hotlead' },
    { path: '/settings', icon: Settings, label: 'Settings', locked: true },
];

export function Sidebar() {
    const { logout } = useAuth();



    return (
        <aside className="w-64 bg-card border-r flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-primary tracking-tight">Data<span className="text-foreground">Gold</span></h1>
                <p className="text-xs text-foreground mt-1 text-center font-bold">You never thought you had</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                item.locked && !isActive && "opacity-50 grayscale hover:opacity-70"
                            )
                        }
                    >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.locked && <Lock className="h-3 w-3" />}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
