import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert, ActivityIndicator, Platform, KeyboardAvoidingView, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Plus, ScanLine, X, Trash2, CheckCircle, Clock, MapPin, Search, MessageSquare, History } from 'lucide-react-native';
import { API_URL, useAuth } from '../context/AuthContext';

export default function ActiveSessionScreen({ route }) {
    const navigation = useNavigation();
    const { customer } = route.params || {};
    const { user } = useAuth();

    // Session State
    const [sessionId, setSessionId] = useState(null);
    const [jewels, setJewels] = useState([]); // Items in CURRENT session
    const [history, setHistory] = useState([]); // Items from PAST sessions

    // UI State
    const [modalVisible, setModalVisible] = useState(false);
    const [scanMode, setScanMode] = useState(null); // 'camera' or 'manual'
    const [manualCode, setManualCode] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        startSession();
        fetchHistory();
    }, []);

    const startSession = async () => {
        try {
            // For real numeric ID, we need to ensure customer object has it. 
            // Fallback to ID 1 for mock if undefined, or handle error.
            const custId = customer?.id || 1;

            const response = await fetch(`${API_URL}/sessions/start?current_user_id=${user?.id || 1}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer_id: parseInt(custId) })
            });

            const data = await response.json();
            if (response.ok) {
                setSessionId(data.session_id);
            } else if (response.status === 400) {
                // Already active (resume logic could be here, or error if locked)
                // For now, if 400, it might mean "Customer is busy" or "Salesman resuming own session"
                // If resuming own, we should fetch active session items (not implemented in main.py yet for resume specific, but history covers past)
                Alert.alert("Session Status", data.detail || "Session issue");
                // If "Customer is busy" we should probably go back?
                if (data.detail && data.detail.includes("busy")) {
                    navigation.goBack();
                }
            }
        } catch (e) {
            console.error("Start Session Error:", e);
            Alert.alert("Error", "Could not start session");
        }
    };

    const fetchHistory = async () => {
        try {
            const custId = customer?.id || 1;
            const response = await fetch(`${API_URL}/customers/${custId}/history`);
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (e) {
            console.error("Fetch History Error:", e);
        }
    };

    const processingRef = useRef(false);

    const addItemToSession = async (code) => {
        if (processingRef.current) return;
        if (!sessionId) {
            Alert.alert("Error", "No active session ID");
            return;
        }

        processingRef.current = true;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/sessions/${sessionId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ barcode: code, comments: comment })
            });

            if (response.ok) {
                // Fetch jewel details for local display
                const jewelResp = await fetch(`${API_URL}/jewels/${code}`);
                const jewelData = await jewelResp.json();

                setJewels(prev => [...prev, { ...jewelData, comment }]);
                setModalVisible(false);
                setManualCode('');
                setComment('');
                setScanMode(null);
            } else {
                const err = await response.json();
                Alert.alert("Error", err.detail || "Failed to add item");
            }
        } catch (error) {
            Alert.alert("Error", "Network error adding item.");
        } finally {
            setLoading(false);
            processingRef.current = false;
        }
    };

    // Track if session was ended intentionally to avoid double-alert on back
    const isSessionEnded = React.useRef(false);

    // Navigation Guard
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // If session is already null (not started) or we explicitly ended it, let them pass.
            if (!sessionId || isSessionEnded.current) {
                return;
            }

            // Prevent default behavior of leaving the screen
            e.preventDefault();

            // Prompt the user before leaving
            Alert.alert(
                'Session Active',
                'You are currently attending a customer. Do you want to End the session?',
                [
                    { text: "Stay", style: 'cancel', onPress: () => { } },
                    {
                        text: 'End Session & Leave',
                        style: 'destructive',
                        onPress: async () => {
                            // End the session silently then navigate
                            try {
                                await fetch(`${API_URL}/sessions/${sessionId}/end`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: "completed", notes: "Ended via exit" })
                                });
                            } catch (err) {
                                console.error("Failed to auto-end session", err);
                            }
                            // Continue the action that triggered the leave
                            isSessionEnded.current = true;
                            navigation.dispatch(e.data.action);
                        },
                    },
                ]
            );
        });

        return unsubscribe;
    }, [navigation, sessionId]);


    const handleEndSession = async () => {
        if (!sessionId) {
            navigation.goBack();
            return;
        }

        let shouldEnd = false;
        if (Platform.OS === 'web') {
            shouldEnd = window.confirm("Are you sure you want to end this session?");
        } else {
            shouldEnd = true;
        }

        if (!shouldEnd && Platform.OS === 'web') return;

        try {
            const response = await fetch(`${API_URL}/sessions/${sessionId}/end`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: "completed", notes: "Session ended" })
            });

            if (response.ok) {
                Alert.alert("Success", "Session ended successfully.");
                isSessionEnded.current = true; // Mark as safely ended
                navigation.goBack();
            } else {
                Alert.alert("Error", "Failed to end session properly");
            }
        } catch (e) {
            console.error("End Session Error:", e);
            navigation.goBack();
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Active Session</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Customer Profile Card */}
                <View style={styles.customerCard}>
                    <View style={[styles.customerImage, { backgroundColor: '#E1E1E1', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 24 }}>👤</Text>
                    </View>
                    <View style={styles.customerInfo}>
                        <Text style={styles.customerID}>{customer?.short_id || 'CUST-XXXX'}</Text>
                        <View style={styles.badgeRow}>
                            <View style={[styles.badge, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Clock size={12} color={theme.colors.primary} />
                                <Text style={[styles.badgeText, { color: theme.colors.primary }]}>Started Now</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: theme.colors.info + '20' }]}>
                                <MapPin size={12} color={theme.colors.info} />
                                <Text style={[styles.badgeText, { color: theme.colors.info }]}>{customer?.floor || 'Floor 1'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* --- History Section --- */}
                {history.length > 0 && (
                    <View style={styles.historySection}>
                        <View style={styles.sectionHeader}>
                            <History size={18} color={theme.colors.textSecondary} />
                            <Text style={styles.sectionTitle}>Previous History</Text>
                        </View>
                        {history.map(session => (
                            <View key={session.session_id} style={styles.historyCard}>
                                <Text style={styles.historyMeta}>
                                    Salesman: {session.salesperson_name} • {new Date(session.start_time).toLocaleTimeString()}
                                </Text>
                                {session.details.map((detail, idx) => (
                                    <View key={idx} style={styles.historyItem}>
                                        <Text style={styles.historyItemName}>• {detail.jewel_name}</Text>
                                        {detail.comments && (
                                            <Text style={styles.historyComment}>"{detail.comments}"</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* --- Current Session Items --- */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Items Shown Now ({jewels.length})</Text>
                </View>

                {jewels.length === 0 ? (
                    <Text style={styles.emptyText}>No items added yet.</Text>
                ) : (
                    jewels.map((jewel, index) => (
                        <View key={index} style={styles.jewelCard}>
                            <View style={styles.jewelIcon}>
                                <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>💎</Text>
                                </View>
                            </View>
                            <View style={styles.jewelInfo}>
                                <Text style={styles.jewelName}>{jewel.name}</Text>
                                <Text style={styles.jewelCode}>{jewel.barcode}</Text>
                                {jewel.comment ? (
                                    <Text style={styles.itemComment}>Note: {jewel.comment}</Text>
                                ) : null}
                            </View>
                        </View>
                    ))
                )}

                {/* Add Button */}
                <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                    <Plus size={24} color="white" />
                    <Text style={styles.addBtnText}>ADD JEWEL</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.endBtn} onPress={handleEndSession}>
                    <Text style={styles.endBtnText}>END SESSION</Text>
                </TouchableOpacity>
            </View>

            {/* Add Jewel Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Jewel</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        {/* Mode Selection */}
                        {!scanMode ? (
                            <View style={styles.modeSelection}>
                                <TouchableOpacity style={styles.modeBtn} onPress={() => setScanMode('camera')}>
                                    <ScanLine size={32} color={theme.colors.primary} />
                                    <Text style={styles.modeText}>Scan QR/Barcode</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modeBtn} onPress={() => setScanMode('manual')}>
                                    <Search size={32} color={theme.colors.info} />
                                    <Text style={styles.modeText}>Enter ID Manually</Text>
                                </TouchableOpacity>
                            </View>
                        ) : scanMode === 'camera' ? (
                            <View style={styles.cameraContainer}>
                                {!permission ? (
                                    <View style={styles.centerCamera}>
                                        <Text>Requesting camera permission...</Text>
                                    </View>
                                ) : !permission.granted ? (
                                    <View style={styles.centerCamera}>
                                        <Text style={{ textAlign: 'center', marginBottom: 10 }}>We need your permission to show the camera</Text>
                                        <Button onPress={requestPermission} title="grant permission" />
                                    </View>
                                ) : (
                                    <CameraView
                                        style={styles.camera}
                                        facing="back"
                                        barcodeScannerSettings={{
                                            barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code128", "code39", "code93", "itf14", "codabar", "pdf417", "aztec", "datamatrix"],
                                        }}
                                        onBarcodeScanned={({ data }) => {
                                            if (!loading) {
                                                setManualCode(data);
                                                setScanMode('manual');
                                            }
                                        }}
                                    >
                                        <View style={styles.cameraOverlay}>
                                            <TouchableOpacity style={styles.closeCameraBtn} onPress={() => setScanMode(null)}>
                                                <X size={24} color="white" />
                                            </TouchableOpacity>
                                            <View style={styles.scanFrame} />
                                            <Text style={styles.scanHint}>Align barcode within frame</Text>
                                        </View>
                                    </CameraView>
                                )}
                            </View>
                        ) : (
                            <View style={styles.manualInputContainer}>
                                {scanMode === 'manual' && (
                                    <>
                                        <Text style={styles.inputLabel}>Enter Jewel ID / Barcode</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. JWL-101"
                                            value={manualCode}
                                            onChangeText={setManualCode}
                                            autoCapitalize="characters"
                                        />
                                    </>
                                )}
                                {scanMode === 'camera' && manualCode !== '' && (
                                    <View style={styles.scannedBadge}>
                                        <CheckCircle size={16} color={theme.colors.success} />
                                        <Text style={styles.scannedText}>Scanned: {manualCode}</Text>
                                    </View>
                                )}

                                <Text style={styles.inputLabel}>Comments (Optional)</Text>
                                <TextInput
                                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                    placeholder="Customer said..."
                                    value={comment}
                                    onChangeText={setComment}
                                    multiline
                                />

                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={() => addItemToSession(manualCode)}
                                    disabled={loading || !manualCode}
                                >
                                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitBtnText}>ADD TO SESSION</Text>}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.textBtn} onPress={() => { setScanMode(null); setManualCode(''); }}>
                                    <Text style={styles.textBtnTitle}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.colors.white,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
    backBtn: { padding: 5 },

    content: { padding: 20, paddingBottom: 100 },

    customerCard: {
        flexDirection: 'row', backgroundColor: theme.colors.white, borderRadius: 16, padding: 15,
        boxShadow: '0px 2px 8px rgba(0,0,0,0.05)', elevation: 3, marginBottom: 20, alignItems: 'center'
    },
    customerImage: { width: 70, height: 70, borderRadius: 35, marginRight: 15, backgroundColor: '#eee' },
    customerInfo: { flex: 1 },
    customerID: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text, marginBottom: 5 },
    badgeRow: { flexDirection: 'row', gap: 8 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, gap: 4 },
    badgeText: { fontSize: 12, fontWeight: '600' },

    // History Styles
    historySection: { marginBottom: 25 },
    historyCard: { backgroundColor: '#F8F9FA', padding: 12, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E9ECEF' },
    historyMeta: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 8, fontWeight: '600' },
    historyItem: { marginBottom: 4 },
    historyItemName: { fontSize: 14, color: theme.colors.text, fontWeight: '500' },
    historyComment: { fontSize: 13, color: theme.colors.textSecondary, fontStyle: 'italic', marginLeft: 10 },

    sectionHeader: { marginBottom: 15, flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },

    jewelCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.white, borderRadius: 12, padding: 12,
        marginBottom: 10, borderWidth: 1, borderColor: theme.colors.border
    },
    jewelIcon: { marginRight: 12 },
    jewelInfo: { flex: 1 },
    jewelName: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
    jewelCode: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
    itemComment: { fontSize: 13, color: theme.colors.info, marginTop: 4, fontStyle: 'italic' },

    emptyText: { color: theme.colors.textSecondary, fontStyle: 'italic' },

    addBtn: {
        backgroundColor: theme.colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        padding: 16, borderRadius: 12, marginTop: 20, gap: 8
    },
    addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.white,
        padding: 20, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingBottom: 30
    },
    endBtn: {
        backgroundColor: theme.colors.danger, padding: 16, borderRadius: 12, alignItems: 'center'
    },
    endBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: theme.colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 25, minHeight: 500 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },

    modeSelection: { gap: 15 },
    modeBtn: {
        flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: theme.colors.card,
        borderRadius: 16, gap: 15, borderWidth: 1, borderColor: theme.colors.border
    },
    modeText: { fontSize: 18, fontWeight: '600', color: theme.colors.text },

    cameraContainer: { height: 400, borderRadius: 16, overflow: 'hidden', marginBottom: 20, backgroundColor: '#000' },
    camera: { flex: 1 },
    centerCamera: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' },
    cameraOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    scanFrame: { width: 250, height: 250, borderWidth: 2, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
    scanHint: { color: 'white', marginTop: 20, fontSize: 14, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.5)', padding: 5, borderRadius: 4 },
    closeCameraBtn: { position: 'absolute', top: 20, right: 20, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, zIndex: 10 },

    manualInputContainer: { gap: 15 },
    inputLabel: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 5 },
    input: {
        backgroundColor: theme.colors.card, padding: 15, borderRadius: 12, fontSize: 16,
        borderWidth: 1, borderColor: theme.colors.border, color: theme.colors.text
    },
    submitBtn: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    textBtn: { alignItems: 'center', padding: 10, marginTop: 10 },
    textBtnTitle: { color: theme.colors.textSecondary, fontWeight: '600' },
    scannedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 217, 100, 0.1)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(76, 217, 100, 0.2)'
    },
    scannedText: {
        color: theme.colors.success,
        fontWeight: 'bold',
        fontSize: 14,
    }
});

