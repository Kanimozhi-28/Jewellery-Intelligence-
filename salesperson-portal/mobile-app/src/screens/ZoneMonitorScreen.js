import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../api/client';
import useAppStore from '../store/useAppStore';
import { Play } from 'lucide-react-native';

const ZoneMonitorScreen = ({ navigation }) => {
    const { currentZone, setZone, setSessionId, salespersonId } = useAppStore();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Poll for customers every 3 seconds
        const interval = setInterval(fetchCustomers, 3000);
        fetchCustomers(); // Initial fetch
        return () => clearInterval(interval);
    }, [currentZone]);

    const fetchCustomers = async () => {
        try {
            const response = await client.get(`/live-customers/${currentZone}`);
            setCustomers(response.data);
        } catch (error) {
            console.log('Error fetching customers:', error);
        }
    };

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

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: `data:image/jpeg;base64,${item.photo}` }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Customer #{item.id.slice(0, 4)}</Text>
                <Text style={styles.assignedText}>
                    {item.salesperson_name ? `Assigned to: ${item.salesperson_name}` : 'Unassigned'}
                </Text>
                <Text style={styles.cardTime}>{new Date(item.detected_at).toLocaleTimeString()}</Text>
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
                            Alert.alert(
                                "Warning",
                                "salesperson001 is now updating their details. please check and end the session.",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            // Simulate resuming/going to session
                                            // Use dummy session ID if needed, or just start one
                                            startService(item.id);
                                        }
                                    }
                                ]
                            );
                        }}
                    >
                        <Text style={styles.buttonText}>End Service</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Live Monitor</Text>

            </View>

            <FlatList
                data={customers}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No customers in Zone {currentZone}</Text>
                }
            />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#D97706" />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 15 },
    zoneSelector: { flexDirection: 'row', justifyContent: 'space-between' },
    zoneButton: {
        flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 8, backgroundColor: '#f0f0f0', alignItems: 'center'
    },
    activeZone: { backgroundColor: '#1E3A8A' },
    zoneText: { color: '#666', fontWeight: '600' },
    activeZoneText: { color: 'white' },
    list: { padding: 15 },
    card: {
        flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 2
    },
    image: { width: 100, height: 100, backgroundColor: '#ddd' },
    cardInfo: { flex: 1, padding: 15, justifyContent: 'space-between' },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    assignedText: { fontSize: 13, color: '#166534', fontWeight: '600', marginBottom: 2 },
    cardTime: { fontSize: 12, color: '#888' },
    actionRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
    actionButton: {
        flex: 1, padding: 8, borderRadius: 6, alignItems: 'center', justifyContent: 'center'
    },
    startButton: { backgroundColor: '#D97706' },
    endButton: { backgroundColor: '#EF4444' },
    buttonText: { color: 'white', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center'
    }
});

export default ZoneMonitorScreen;
