import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

// Replace with your local IP if running on physical device
export const API_URL = 'http://10.100.100.142:8002';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        try {
            console.log("Attempting login via:", `${API_URL}/login`);
            // For demo, we might mock this or hit the backend
            const response = await axios.post(`${API_URL}/login`, { username, password }, { timeout: 5000 });
            console.log("Login Response:", response.data);

            if (response.data.user_id) {
                setUser({
                    id: response.data.user_id,
                    name: response.data.full_name,
                    role: response.data.role || 'salesman'
                });
                return true;
            } else {
                alert("Login Failed: Response missing user_id. " + JSON.stringify(response.data));
            }
        } catch (e) {
            console.error("Login caught error:", e);
            console.log("Login Error Details:", e.response?.data || e.message);

            // Show actual error to user for debugging
            if (e.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                alert(`Login Failed: ${e.response.data.detail || e.response.data.error || 'Server Error'}`);
            } else if (e.request) {
                // The request was made but no response was received
                alert("Login Failed: No response from server. Check network connectivity to " + API_URL);
            } else {
                alert(`Login Failed: ${e.message}`);
            }

            // Fallback for demo if backend isn't running
            if (username === 'admin' && password === 'password') {
                setUser({ id: 1, name: 'Demo Salesman' });
                return true;
            }
            return false;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
