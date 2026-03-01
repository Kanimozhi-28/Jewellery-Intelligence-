import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (employeeId, password) => {
        // Mock login logic
        let role = 'salesperson';
        if (employeeId.toLowerCase().includes('admin')) {
            role = 'admin';
        }

        const userData = {
            id: employeeId,
            name: role === 'admin' ? 'Admin User' : 'Sales Professional',
            role: role,
            token: 'mock-jwt-token-' + Math.random().toString(36).substr(2)
        };

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <div className="flex items-center justify-center min-h-screen">Unauthorized Access</div>;
    }

    return children;
};
