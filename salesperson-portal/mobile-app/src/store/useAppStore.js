import { create } from 'zustand';

const useAppStore = create((set) => ({
    salespersonId: 'EMP001', // Hardcoded for PoC
    currentZone: 'A',
    sessionId: null, // Stores the active session UUID

    setSalespersonId: (id) => set({ salespersonId: id }),
    setZone: (zone) => set({ currentZone: zone }),
    setSessionId: (id) => set({ sessionId: id }),

    // Helper to clear session
    clearSession: () => set({ sessionId: null }),
}));

export default useAppStore;
