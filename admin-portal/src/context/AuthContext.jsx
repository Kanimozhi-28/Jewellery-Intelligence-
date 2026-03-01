import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking local storage for potential persistent login
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            console.log('Attempting login with username:', username);
            
            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            console.log('Login response status:', response.status);

            if (response.ok) {
                const userData = await response.json();
                console.log('Login successful, user data:', userData);
                setUser(userData);
                localStorage.setItem('adminUser', JSON.stringify(userData));
                return { success: true, user: userData };
            } else {
                // Try to get error message from backend
                let errorMessage = "Invalid username or password";
                try {
                    const errorData = await response.json();
                    console.log('Login error response:', errorData);
                    if (errorData.detail) {
                        errorMessage = errorData.detail;
                    }
                } catch (e) {
                    // If response is not JSON, use default message
                    console.error("Error parsing response:", e);
                }
                return { success: false, message: errorMessage };
            }
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: "Network error. Please check if the server is running." };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('adminUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
