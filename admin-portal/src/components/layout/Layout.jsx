import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <div className="min-h-screen bg-muted/40 font-sans antialiased">
            <Sidebar />
            <Header />
            <main className="ml-64 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
                <Outlet />
            </main>
        </div>
    );
}
