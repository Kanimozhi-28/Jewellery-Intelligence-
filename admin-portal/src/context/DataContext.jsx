import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    fetchSalespersons,
    fetchCustomers,
    fetchJewellery,
    fetchSessions,
    fetchFamilyClusters,
    fetchDashboardMetrics
} from '../services/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [jewellery, setJewellery] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [salespersons, setSalespersons] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]); // Still mock for now or fetch if endpoint exists
    const [familyClusters, setFamilyClusters] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const results = await Promise.allSettled([
                    fetchJewellery(),
                    fetchCustomers(),
                    fetchSalespersons(),
                    fetchSessions(),
                    fetchFamilyClusters(),
                    fetchDashboardMetrics()
                ]);

                // Helper to get value or default
                const getValue = (result, defaultVal) => result.status === 'fulfilled' ? result.value : defaultVal;

                setJewellery(getValue(results[0], []));

                // Mapped Customers
                const rawCustomers = getValue(results[1], []);
                const mappedCustomers = rawCustomers.map(c => ({
                    ...c,
                    photo: c.photo_url || c.photo, // Map Base64 or URL
                    visits: c.total_visits || c.visits || 1
                }));
                setCustomers(mappedCustomers);

                // Mapped users - now backend has fields but we respect frontend overrides if needed
                const rawSessions = getValue(results[3], []);
                const rawUsers = getValue(results[2], []);

                const mappedSalespersons = rawUsers.map(u => {
                    // Calculate sales based on sessions
                    const userSessions = rawSessions.filter(s => s.salesperson_id === u.id || (s.salesperson && s.salesperson.id === u.id));
                    const salesValue = userSessions.length * 125000; // Using estimated value per session as per Dashboard

                    return {
                        id: u.id,
                        name: u.full_name || u.name,
                        role: u.role,
                        zone: u.zone || "First Floor",
                        status: u.status_text || u.status || "Active",
                        sales: salesValue || u.sales || 0, // Prefer calculated value
                        customersAttended: userSessions.length,
                        managerialNotes: "",
                        password: u.password,
                        hasEmbedding: u.has_embedding,
                        photo: u.photo_url || u.photo || null
                    };
                });
                setSalespersons(mappedSalespersons);

                setSessions(rawSessions);
                setFamilyClusters(getValue(results[4], []));
                setMetrics(getValue(results[5], null));

                // Map Audit Logs (id, user, action, time)
                const rawLogs = await import('../services/api').then(module => module.fetchAuditLogs()).catch(() => []);
                const mappedLogs = rawLogs.map(log => ({
                    id: log.id,
                    user: log.username,
                    action: `${log.action} - ${log.details || ''}`,
                    time: new Date(log.created_at).toLocaleString()
                }));
                setAuditLogs(mappedLogs);

                setLoading(false);
            } catch (error) {
                console.error("Critical failure in initial data load:", error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Salesperson Actions (Stubbed for now as we need API endpoints for mutations)
    // Salesperson Actions
    const addSalesperson = async (person) => {
        try {
            const newUser = await import('../services/api').then(module => module.createSalesperson(person));
            // Map back to UI format
            const mappedUser = {
                id: newUser.id,
                name: newUser.full_name || newUser.name,
                role: newUser.role,
                zone: newUser.zone || "First Floor",
                status: newUser.status_text || newUser.status || "Active",
                sales: newUser.sales_count || newUser.sales || 0,
                password: newUser.password,
                photo: newUser.photo_url || newUser.photo || null
            };
            setSalespersons([...salespersons, mappedUser]);
        } catch (error) {
            console.error("Failed to add salesperson:", error);
            alert("Failed to add salesperson. See console.");
        }
    };

    const updateSalesperson = async (id, updatedPerson) => {
        try {
            // Fetch current to merge sales count if needed, or pass current sales
            const updated = await import('../services/api').then(module => module.updateSalesperson(id, updatedPerson));

            const mappedUser = {
                id: updated.id,
                name: updated.full_name || updated.name,
                role: updated.role,
                zone: updated.zone || "First Floor",
                status: updated.status_text || updated.status || "Active",
                sales: updated.sales_count || updated.sales || 0,
                password: updated.password,
                photo: updated.photo_url || updated.photo || null
            };

            setSalespersons(salespersons.map(p => p.id === id ? mappedUser : p));
        } catch (error) {
            console.error("Failed to update salesperson:", error);
            alert("Failed to update salesperson. See console.");
        }
    };

    const deleteSalesperson = async (id) => {
        try {
            await import('../services/api').then(module => module.deleteSalesperson(id));
            setSalespersons(salespersons.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete salesperson:", error);
            alert("Failed to delete salesperson. See console.");
        }
    };

    const addAuditLog = (action) => {
        const newLog = {
            id: auditLogs.length + 1,
            user: "Admin",
            action,
            time: new Date().toLocaleString()
        };
        setAuditLogs([newLog, ...auditLogs]);
    };

    return (
        <DataContext.Provider value={{
            jewellery, setJewellery,
            customers, setCustomers,
            salespersons, addSalesperson, updateSalesperson, deleteSalesperson,
            sessions, setSessions,
            familyClusters, setFamilyClusters,
            metrics,
            auditLogs, addAuditLog,
            loading
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
