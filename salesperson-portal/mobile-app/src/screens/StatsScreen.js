import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Trophy, Users, Play, X } from 'lucide-react-native';
import client from '../api/client';
import useAppStore from '../store/useAppStore';

const StatsScreen = ({ navigation }) => {
    const { salespersonId, setSessionId } = useAppStore();
    const [empId, setEmpId] = useState('');
    const [salesCount, setSalesCount] = useState(null);
    const [unassignedCustomers, setUnassignedCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch Unassigned Customers
    const fetchUnassignedCustomers = async () => {
        try {
            // Fetch for both zones or default 'gold' - for now fetching 'gold' to match monitor
            const response = await client.get(`/live-customers/gold`);
            const allCustomers = response.data;
            // Filter only unassigned
            const unassigned = allCustomers.filter(c => !c.salesperson_name);
            setUnassignedCustomers(unassigned);
        } catch (error) {
            console.log('Error fetching unassigned customers:', error);
        }
    };

    useEffect(() => {
        fetchUnassignedCustomers();
        const interval = setInterval(fetchUnassignedCustomers, 5000);
        return () => clearInterval(interval);
    }, []);

    const startService = async (customerId) => {
        setLoading(true);
        try {
            const response = await client.post('/sessions/start', null, {
                params: {
                    customer_id: customerId,
                    salesperson_id: salespersonId,
                },
            });
            const session = response.data;
            setSessionId(String(session.id));
            navigation.navigate('Active Session');
        } catch (error) {
            alert('Failed to start session: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Dummy Logic for Filter
    const handleSearch = () => {
        if (empId.trim()) setSalesCount(Math.floor(Math.random() * 50) + 10);
    };

    // Dummy Leaderboard Data
    const leaderboard = [
        { rank: 1, name: 'Arunkumar', sales: 80000, color: '#FFD700' },
        { rank: 2, name: 'Vishwa', sales: 70000, color: '#C0C0C0' },
        { rank: 3, name: 'Muthu', sales: 50000, color: '#CD7F32' },
    ];

    const DetailedCustomerCard = ({ item }) => (
        <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
                <Text style={styles.detailCardTitle}>Unassigned Customer Details</Text>
                <TouchableOpacity onPress={() => setSelectedCustomer(null)}>
                    <X size={20} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.cardContent}>
                <Image
                    source={{ uri: `data:image/jpeg;base64,${item.photo}` }}
                    style={styles.detailImage}
                    resizeMode="cover"
                />
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>Customer #{item.id.slice(0, 4)}</Text>

                    <Text style={styles.cardTime}>Detected: {new Date(item.detected_at).toLocaleTimeString()}</Text>

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.startButton]}
                            onPress={() => startService(item.id)}
                        >
                            <Text style={styles.buttonText}>Start Service</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.endButton]}
                            onPress={() => {
                                Alert.alert("Warning", "salesperson001 is now updating their details. please check and end the session.", [
                                    { text: "OK", onPress: () => startService(item.id) }
                                ]);
                            }}
                        >
                            <Text style={styles.buttonText}>End Service</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.headerTitle}>Dashboard</Text>

                {/* 1. Sales Filter Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Check Sales Performance</Text>
                    <View style={styles.searchRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Emp ID (e.g. EMP001)"
                            placeholderTextColor="#999"
                            value={empId}
                            onChangeText={setEmpId}
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Search color="white" size={20} />
                        </TouchableOpacity>
                    </View>
                    {salesCount !== null && (
                        <View style={styles.resultContainer}>
                            <Text style={styles.resultLabel}>Total Sales Done</Text>
                            <Text style={styles.resultValue}>{salesCount}</Text>
                        </View>
                    )}
                </View>

                {/* 2. Unassigned Customers Section */}
                <View style={styles.card}>
                    {/* Total Count Header */}
                    <View style={styles.totalHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Total No of Customers</Text>
                            <Text style={styles.subText}>Live Count</Text>
                        </View>
                        <View style={styles.totalBadge}>
                            <Users size={20} color="#1E3A8A" />
                            <Text style={styles.totalCount}>120</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Unassigned Section */}
                    <View style={styles.trafficHeader}>
                        <View>
                            <Text style={styles.sectionTitleSmall}>Unassigned Customers ({unassignedCustomers.length})</Text>
                            <Text style={styles.subText}>Tap to view details & assign</Text>
                        </View>
                    </View>

                    {unassignedCustomers.length === 0 ? (
                        <Text style={styles.emptyText}>No unassigned customers.</Text>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarRow}>
                            {unassignedCustomers.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.avatarContainer,
                                        selectedCustomer?.id === item.id && styles.avatarSelected
                                    ]}
                                    onPress={() => setSelectedCustomer(item)}
                                >
                                    <Image
                                        source={{ uri: `data:image/jpeg;base64,${item.photo}` }}
                                        style={styles.avatar}
                                    />
                                    <Text style={styles.avatarId}>#{item.id.slice(0, 4)}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    {/* Show Details Box if selected */}
                    {selectedCustomer && (
                        <DetailedCustomerCard item={selectedCustomer} />
                    )}
                </View>

                {/* 3. Leaderboard Section */}
                <View style={styles.card}>
                    <View style={styles.leaderboardHeader}>
                        <Trophy color="#D97706" size={24} />
                        <Text style={[styles.sectionTitle, { marginLeft: 10 }]}>Top Performers</Text>
                    </View>

                    <View style={styles.leaderboardList}>
                        {leaderboard.map((item) => (
                            <View key={item.rank} style={styles.rankRow}>
                                <View style={[styles.rankBadge, { backgroundColor: item.color }]}>
                                    <Text style={styles.rankText}>{item.rank}</Text>
                                </View>
                                <Text style={styles.rankName}>{item.name}</Text>
                                <Text style={styles.rankSales}>${item.sales.toLocaleString()}</Text>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#D97706" />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    content: { padding: 20 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 20 },

    card: {
        backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3
    },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
    subText: { fontSize: 13, color: '#6B7280', marginTop: 2 },

    // Search
    searchRow: { flexDirection: 'row', marginTop: 15 },
    input: {
        flex: 1, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
        borderRadius: 10, paddingHorizontal: 15, fontSize: 16, height: 50
    },
    searchButton: {
        width: 50, height: 50, backgroundColor: '#1E3A8A', borderRadius: 10,
        marginLeft: 10, alignItems: 'center', justifyContent: 'center'
    },
    resultContainer: { marginTop: 15, padding: 15, backgroundColor: '#EFF6FF', borderRadius: 10, alignItems: 'center' },
    resultLabel: { fontSize: 14, color: '#1E3A8A', fontWeight: 'bold' },
    resultValue: { fontSize: 32, fontWeight: '900', color: '#1E3A8A' },

    // Traffic Section
    totalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#DBEAFE',
        paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20
    },
    totalCount: { marginLeft: 8, fontWeight: '900', color: '#1E3A8A', fontSize: 18 },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 15 },

    trafficHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitleSmall: { fontSize: 16, fontWeight: '700', color: '#4B5563' },

    trafficBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2',
        paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20
    },
    trafficCount: { marginLeft: 8, fontWeight: 'bold', color: '#B91C1C' },
    avatarRow: { flexDirection: 'row', marginTop: 15 },
    avatarContainer: { marginRight: 15, alignItems: 'center', padding: 5 },
    avatarSelected: { backgroundColor: '#DBEAFE', borderRadius: 10 },
    avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff' },
    avatarId: { fontSize: 11, color: '#6B7280', marginTop: 4, fontWeight: '500' },
    emptyText: { marginTop: 10, color: '#999', fontStyle: 'italic' },

    // Detail Box (Inner Card)
    detailCard: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
    },
    detailCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 10 },
    detailCardTitle: { fontWeight: '800', color: '#111827', fontSize: 16 },
    cardContent: { flexDirection: 'row', alignItems: 'center' },
    detailImage: { width: 90, height: 90, borderRadius: 12, backgroundColor: '#F3F4F6' },
    cardInfo: { flex: 1, marginLeft: 20 },
    cardTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
    unassignedStatus: { fontSize: 14, color: '#D97706', fontWeight: '600', marginBottom: 6, backgroundColor: '#FEF3C7', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    cardTime: { fontSize: 13, color: '#6B7280', marginBottom: 12 },

    actionRow: { flexDirection: 'row', gap: 12 },
    actionButton: {
        flex: 1,
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    startButton: { backgroundColor: '#D97706' },
    endButton: { backgroundColor: '#EF4444' },
    buttonText: { color: 'white', fontWeight: 'bold' },

    // Leaderboard
    leaderboardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    leaderboardList: { marginTop: 5 },
    rankRow: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6'
    },
    rankBadge: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    rankText: { fontSize: 14, fontWeight: 'bold', color: 'white' },
    rankName: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '600', color: '#374151' },
    rankSales: { fontSize: 16, fontWeight: 'bold', color: '#059669' },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center'
    }
});

export default StatsScreen;
