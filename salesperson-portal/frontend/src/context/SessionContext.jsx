import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SessionContext = createContext(null);

const API_BASE_URL = `http://${window.location.hostname}:8000/api/operational`;

export const SessionProvider = ({ children }) => {
    const [activeSession, setActiveSession] = useState(null);
    const [scannedItems, setScannedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Persist session across refreshes
    useEffect(() => {
        const savedSession = localStorage.getItem('active_session');
        if (savedSession) {
            const session = JSON.parse(savedSession);
            setActiveSession(session);
            fetchScans(session.id);
        }
    }, []);

    const fetchScans = async (sessionId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}/scans`);
            setScannedItems(response.data);
        } catch (err) {
            console.error("Failed to fetch scans", err);
        }
    };

    const startSession = async (customerId, salespersonId) => {
        setLoading(true);
        setError(null);
        console.log(`Starting session: customer=${customerId}, salesperson=${salespersonId}`);
        try {
            const response = await axios.post(`${API_BASE_URL}/sessions/start?customer_id=${customerId}&salesperson_id=${salespersonId}`);
            const newSession = response.data;
            setActiveSession(newSession);
            setScannedItems([]);
            localStorage.setItem('active_session', JSON.stringify(newSession));
            return newSession;
        } catch (err) {
            const msg = err.response?.data?.detail || err.message || "Failed to start session";
            console.error("Session start error:", msg);
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const endSession = async () => {
        if (!activeSession) return;
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/sessions/end/${activeSession.id}`);
            setActiveSession(null);
            setScannedItems([]);
            localStorage.removeItem('active_session');
        } catch (err) {
            setError("Failed to end session");
        } finally {
            setLoading(false);
        }
    };

    const scanJewellery = async (barcode) => {
        if (!activeSession) {
            setError("No active session");
            return;
        }

        // Prevent frontend duplicate check (optional, backend also checks)
        if (scannedItems.find(item => item.barcode === barcode)) {
            setError("Duplicate scan: Item already added");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/scan-jewellery`, {
                session_id: activeSession.id,
                jewellery_code: barcode
            });
            const newScan = response.data;
            setScannedItems(prev => [newScan, ...prev]);
            return newScan;
        } catch (err) {
            const msg = err.response?.data?.detail || "Scan failed";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const updateScanComment = async (scanId, comment) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/scans/${scanId}?comment=${encodeURIComponent(comment)}`);
            const updatedScan = response.data;
            setScannedItems(prev => prev.map(item => item.id === scanId ? updatedScan : item));
        } catch (err) {
            console.error("Failed to update comment", err);
        }
    };

    return (
        <SessionContext.Provider value={{
            activeSession,
            scannedItems,
            loading,
            error,
            setError,
            startSession,
            endSession,
            scanJewellery,
            updateScanComment,
            fetchScans
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
