import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, useAuth } from './context/AuthContext';
import { SessionProvider } from './context/SessionContext';
import { Sidebar } from './components/Sidebar';

// Salesperson Pages
const ZoneSelection = React.lazy(() => import('./pages/ZoneSelection'));
const LiveCustomers = React.lazy(() => import('./pages/LiveCustomers'));
const ScanJewellery = React.lazy(() => import('./pages/ScanJewellery'));
const Summary = React.lazy(() => import('./pages/Summary'));
const Login = React.lazy(() => import('./pages/Login'));

import { NotificationPoller } from './components/NotificationPoller';
import { TestBell } from './components/TestBell';

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <NotificationPoller />
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </React.Fragment>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/zones" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/*" element={
        <ProtectedRoute allowedRoles={['salesperson']}>
          <Layout>
            <Routes>
              <Route path="/zones" element={<ZoneSelection />} />
              <Route path="/customers" element={<LiveCustomers />} />
              <Route path="/scan" element={<ScanJewellery />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="*" element={<Navigate to="/zones" />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <BrowserRouter>
          <React.Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-black text-gold font-bold">SALES PORTAL LOADING...</div>}>
            <AppRoutes />
          </React.Suspense>
        </BrowserRouter>
      </SessionProvider>
    </AuthProvider>
  );
}

export default App;
