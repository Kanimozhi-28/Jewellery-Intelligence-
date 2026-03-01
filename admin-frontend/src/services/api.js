import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchDashboardMetrics = async () => {
    const response = await api.get('/metrics/');
    return response.data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const fetchSalespersons = async () => {
    const response = await api.get('/users/?role=salesman'); // Filtering by role if backend supports or just /users/
    return response.data;
};

export const createSalesperson = async (data) => {
    // Map frontend data to backend schema
    const payload = {
        username: data.username || data.name.toLowerCase().replace(/\s/g, ''),
        password: data.password || "default123", // Use provided or fallback
        full_name: data.name,
        role: data.role, // Use the selected role from form
        zone: data.zone,
        sales_count: data.sales,
        status: data.status,
        photo: data.photo
    };
    const response = await api.post('/users/', payload);
    return response.data;
};

export const deleteSalesperson = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

export const updateSalesperson = async (id, data) => {
    const payload = {
        username: data.username || `user_${id}`,
        password: data.password, // Use actual password from form
        full_name: data.name,
        role: data.role,
        zone: data.zone,
        sales_count: data.sales,
        status: data.status,
        status: data.status,
        photo: data.photo
    };
    const response = await api.put(`/users/${id}`, payload);
    return response.data;
};

export const fetchCustomers = async () => {
    const response = await api.get('/customers/');
    return response.data;
};

export const fetchJewellery = async () => {
    const response = await api.get('/jewels/');
    return response.data;
};

export const fetchSessions = async () => {
    const response = await api.get('/sessions/');
    return response.data;
};

export const fetchFamilyClusters = async () => {
    const response = await api.get('/family-clusters/');
    return response.data;
};

export const fetchAuditLogs = async () => {
    const response = await api.get('/audit-logs/');
    return response.data;
};

export const fetchActivityHeatmap = async () => {
    const response = await api.get('/activity-heatmap/');
    return response.data;
};

// --- CRE Services ---
export const fetchFloatingCustomers = async () => {
    const response = await api.get('/customers/floating/');
    return response.data;
};

export const markCustomerIgnored = async (customerId, isIgnored = true) => {
    const response = await api.put(`/customers/${customerId}/ignore?is_ignored=${isIgnored}`);
    return response.data;
};

export const allocateCustomer = async (allocationData) => {
    const response = await api.post('/sessions/allocate', allocationData);
    return response.data;
};
