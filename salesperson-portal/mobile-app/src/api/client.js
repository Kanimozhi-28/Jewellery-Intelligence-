import axios from 'axios';

// Connects to the local backend (Ensure your phone is on the same WiFi)
const API_URL = 'http://10.100.100.142:8000/api/operational';

const client = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Bypass-Tunnel-Reminder': 'true', // Bypasses the LocalTunnel password screen
    }
});

export default client;
