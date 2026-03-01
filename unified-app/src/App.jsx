import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';

// Pages - We'll implement these next
const Login = React.lazy(() => import('./pages/Login'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const JewelleryAnalytics = React.lazy(() => import('./pages/admin/JewelleryAnalytics'));
const SalesPerformance = React.lazy(() => import('./pages/admin/SalesPerformance'));
const ZoneAnalytics = React.lazy(() => import('./pages/admin/ZoneAnalytics'));
const LostOpportunities = React.lazy(() => import('./pages/admin/LostOpportunities'));
const AdminSettings = React.lazy(() => import('./pages/admin/Settings'));
const SalesZones = React.lazy(() => import('./pages/sales/ZoneSelection'));
const LiveCustomers = React.lazy(() => import('./pages/sales/LiveCustomers'));
const ScanJewellery = React.lazy(() => import('./pages/sales/ScanJewellery'));
const SessionSummary = React.lazy(() => import('./pages/sales/Summary'));

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Salesperson Routes */}
      <Route path="/sales/*" element={
        <ProtectedRoute allowedRoles={['salesperson']}>
          <Layout>
            <Routes>
              <Route path="zones" element={<SalesZones />} />
              <Route path="customers" element={<LiveCustomers />} />
              <Route path="scan" element={<ScanJewellery />} />
              <Route path="summary" element={<SessionSummary />} />
              <Route path="*" element={<Navigate to="zones" />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="jewellery" element={<JewelleryAnalytics />} />
              <Route path="sales-team" element={<SalesPerformance />} />
              <Route path="zones" element={<ZoneAnalytics />} />
              <Route path="lost-opps" element={<LostOpportunities />} />
              <Route path="reports" element={<AdminSettings />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/sales/zones') : '/login'} />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <React.Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-black text-gold font-bold">LOADING...</div>}>
          <AppRoutes />
        </React.Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
