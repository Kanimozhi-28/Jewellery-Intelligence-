export const ZONES = [
    { id: 'gold', name: 'Gold Zone', floor: 1, color: '#d4af37', activeCount: 12 },
    { id: 'diamond', name: 'Diamond Zone', floor: 1, color: '#b8c6db', activeCount: 8 },
    { id: 'silver', name: 'Silver Zone', floor: 2, color: '#c0c0c0', activeCount: 5 },
];

export const MOCK_CUSTOMERS = [
    { id: 'CUST-304', zoneId: 'gold', detectedAt: '2 min ago', thumbnail: '/api/placeholder/100/100' },
    { id: 'CUST-305', zoneId: 'gold', detectedAt: '5 min ago', thumbnail: '/api/placeholder/100/100' },
    { id: 'CUST-306', zoneId: 'diamond', detectedAt: '12 min ago', thumbnail: '/api/placeholder/100/100' },
];

export const JEWELLERY_DATA = [
    { barcode: 'JWL001', name: 'Classic Gold Ring', category: 'Ring', price: 45000 },
    { barcode: 'JWL002', name: 'Diamond Studs', category: 'Earrings', price: 85000 },
    { barcode: 'JWL003', name: 'Tennis Bracelet', category: 'Bracelet', price: 125000 },
    { barcode: 'JWL004', name: 'Gold Chain 22k', category: 'Chain', price: 65000 },
    { barcode: 'JWL005', name: 'Emerald Pendant', category: 'Pendant', price: 95000 },
];
