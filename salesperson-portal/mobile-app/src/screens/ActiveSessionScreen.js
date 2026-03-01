import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../api/client';
import useAppStore from '../store/useAppStore';
import { Scan, XCircle } from 'lucide-react-native';

const ActiveSessionScreen = ({ navigation }) => {
    const { sessionId, setSessionId } = useAppStore();
    const [barcode, setBarcode] = useState('');
    const [scannedItems, setScannedItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sessionId) {
            fetchScans();
        }
    }, [sessionId]);

    const fetchScans = async () => {
        try {
            const response = await client.get(`/sessions/${sessionId}/scans`);
            setScannedItems(response.data);
        } catch (error) {
            console.log('Error fetching scans:', error);
        }
    };

    const scanItem = async () => {
        if (!barcode.trim()) return;

        setLoading(true);
        try {
            await client.post('/scan-jewellery', {
                session_id: sessionId,
                jewellery_code: barcode
            });
            setBarcode('');
            fetchScans(); // Refresh list
        } catch (error) {
            Alert.alert('Scan Failed', error.response?.data?.detail || error.message);
        } finally {
            setLoading(false);
        }
    };

    const endSession = async () => {
        try {
            await client.post(`/sessions/end/${sessionId}`);
            setSessionId(null);
            setScannedItems([]);
            navigation.navigate('Zone Monitor');
        } catch (error) {
            Alert.alert('Error', 'Could not end session');
        }
    };

    if (!sessionId) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.inactiveText}>No Customer Selected</Text>
                <Text style={styles.subText}>Go to Zone Monitor to start.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Serving Customer</Text>
                <Text style={styles.sessionId}>Session: {sessionId ? String(sessionId).slice(0, 8) : ''}...</Text>
            </View>

            <View style={styles.scanSection}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Barcode (e.g. JWL-001)"
                    value={barcode}
                    onChangeText={setBarcode}
                />
                <TouchableOpacity style={styles.scanButton} onPress={scanItem} disabled={loading}>
                    <Scan color="white" size={24} />
                    <Text style={styles.scanButtonText}>ADD ITEM</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={scannedItems}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemName}>{item.name || 'Unknown Item'}</Text>
                            <Text style={styles.itemCode}>{item.barcode}</Text>
                            <TextInput
                                placeholder="Add comment..."
                                style={styles.commentInput}
                                placeholderTextColor="#999"
                            />
                        </View>
                        <Text style={styles.itemPrice}>${item.price}</Text>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.endButton} onPress={endSession}>
                <XCircle color="white" size={20} />
                <Text style={styles.endButtonText}>End Session</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    inactiveText: { fontSize: 20, color: '#888', fontWeight: 'bold' },
    subText: { color: '#aaa', marginTop: 10 },
    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E3A8A' },
    sessionId: { color: '#888', fontSize: 12 },
    scanSection: { padding: 20, backgroundColor: 'white', margin: 15, borderRadius: 12, elevation: 2 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 15 },
    scanButton: {
        flexDirection: 'row', backgroundColor: '#1E3A8A', padding: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center'
    },
    scanButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
    list: { flex: 1, paddingHorizontal: 15 },
    itemRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8
    },
    itemName: { fontWeight: '600', fontSize: 16, color: '#333' },
    commentInput: {
        backgroundColor: '#f9f9f9', padding: 5, borderRadius: 5, marginTop: 5, fontSize: 12, borderWidth: 1, borderColor: '#eee'
    },
    itemCode: { color: '#888', fontSize: 12 },
    itemPrice: { fontWeight: 'bold', color: '#D97706', fontSize: 16 },
    endButton: {
        flexDirection: 'row', backgroundColor: '#EF4444', padding: 15, margin: 20, borderRadius: 8, alignItems: 'center', justifyContent: 'center'
    },
    endButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 10 }
});

export default ActiveSessionScreen;
