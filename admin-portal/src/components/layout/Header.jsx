import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export function Header() {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, title: 'Stock Alert', message: 'Diamond Necklace (ID: 1) is running low on stock.', time: '10m ago' },
        { id: 2, title: 'High Traffic', message: 'Unusual crowd density detected on Floor 2.', time: '45m ago' },
        { id: 3, title: 'New Sale', message: 'Alice Johnson just closed a ₹12,50,000 deal!', time: '1h ago' },
        { id: 4, title: 'System Update', message: 'Maintenance scheduled for tonight at 2 AM.', time: '5h ago' },
    ];

    const [isDark, setIsDark] = useState(() => {
        if (localStorage.getItem('theme') === 'dark') return true;
        if (localStorage.getItem('theme') === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between ml-64 sticky top-0 z-10">
            <div className="flex items-center text-sm text-muted-foreground">
                Welcome back, <span className="font-semibold text-foreground ml-1">{user?.username || 'Admin'}</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Button variant="ghost" size="icon" className="relative" onClick={() => setShowNotifications(!showNotifications)}>
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
                    </Button>
                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-80 rounded-md border bg-card shadow-lg z-20 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-4 border-b">
                                    <h4 className="font-semibold text-sm">Notifications</h4>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className="p-4 border-b last:border-0 hover:bg-muted/50 text-left">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-sm font-medium">{notif.title}</span>
                                                <span className="text-[10px] text-muted-foreground text-nowrap ml-2">{notif.time}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-2 border-t bg-muted/20 text-center">
                                    <Button variant="ghost" size="sm" className="text-xs w-full h-8">Mark all as read</Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDark(!isDark)}
                >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    A
                </div>
            </div>
        </header>
    );
}
