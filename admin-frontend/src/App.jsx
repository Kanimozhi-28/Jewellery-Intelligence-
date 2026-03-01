import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Salesmen from './pages/Salesmen';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Integrations from './pages/Integrations';
import AIHotlead from './pages/AIHotlead';
import CREView from './pages/CREView';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/salesmen" element={<Salesmen />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/ai-hotlead" element={<AIHotlead />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/cre" element={<CREView />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
