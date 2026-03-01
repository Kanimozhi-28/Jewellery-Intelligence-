import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, Dimensions, Platform, Modal, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search, MapPin, Clock, Eye, EyeOff, Play, RotateCw, Edit2, X, Save, Lock, Users, Plus } from 'lucide-react-native';
import { API_URL, useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function CustomersScreen({ route }) {
    const navigation = useNavigation();
    const { user } = useAuth(); // Get current user
    const { filter: initialFilter } = route.params || {};
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(initialFilter || 'All');
    const [assignedAlert, setAssignedAlert] = useState(null);

    // Real Data State
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Status State: Map of customerId -> { status: 'busy'|'available', salesperson_id, salesperson_name }
    const [customerStatuses, setCustomerStatuses] = useState({});

    // Privacy Mode
    const [revealedIds, setRevealedIds] = useState({});

    // Edit Modal
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editName, setEditName] = useState('');

    // Poll for status when screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchData();
            // Poll every 5 seconds for updates
            const interval = setInterval(fetchData, 5000);
            return () => clearInterval(interval);
        }, [])
    );

    const fetchData = async () => {
        try {
            // 1. Fetch Customers
            const custResp = await fetch(`${API_URL}/customers?salesperson_id=${user?.id || ''}`);
            if (custResp.ok) {
                const custData = await custResp.json();
                setCustomers(custData);

                // 2. Fetch Statuses for all fetched customers
                const newStatuses = {};
                for (const cust of custData) {
                    try {
                        const statusResp = await fetch(`${API_URL}/customers/${cust.id}/status`);
                        if (statusResp.ok) {
                            newStatuses[cust.id] = await statusResp.json();
                        }
                    } catch (err) {
                        // Silent fail for individual status
                    }
                }
                setCustomerStatuses(newStatuses);
            }
        } catch (e) {
            console.error("Error fetching data:", e);
        } finally {
            setLoading(false);
        }
    };

    // Family Modal State
    const [familyModalVisible, setFamilyModalVisible] = useState(false);
    const [familyMode, setFamilyMode] = useState('create'); // 'create' or 'add'
    const [famName, setFamName] = useState('');     // Used for Creating
    const [famRel, setFamRel] = useState('');       // Used for Relationship

    // Search State for "Add to Family"
    const [famSearch, setFamSearch] = useState('');
    const [famResults, setFamResults] = useState([]);
    const [selectedFamily, setSelectedFamily] = useState(null); // The family object selected from search

    const openFamilyModal = (customer) => {
        setSelectedCustomer(customer);
        // Auto-fill Family Name with Customer ID (or Short ID)
        setFamName(customer.short_id || customer.id.toString());
        setFamRel('');
        setFamSearch('');
        setFamResults([]);
        setSelectedFamily(null);
        setFamilyMode('create'); // Start with Create
        setFamilyModalVisible(true);
    };

    // Load families initially when switching to Add mode
    useEffect(() => {
        if (familyMode === 'add') {
            searchFamilies(''); // Load all
        }
    }, [familyMode]);

    // Local filtering if we have all results, or remote search?
    // User wants "list of all existing families... above that the search option"
    // Let's stick to remote search for scale, but initially fetch all.
    // If text changes, we filter locally or re-fetch? Re-fetching is safer for now.

    useEffect(() => {
        if (familyMode === 'add') {
            const delayDebounceFn = setTimeout(() => {
                searchFamilies(famSearch);
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [famSearch]);

    const searchFamilies = async (query) => {
        try {
            const res = await fetch(`${API_URL}/families?search=${query}`);
            if (res.ok) {
                const data = await res.json();
                setFamResults(data);
            }
        } catch (e) { console.error(e); }
    };

    const handleFamilyAction = async () => {
        try {
            if (familyMode === 'create') {
                if (!famName) { Alert.alert("Error", "Enter family name"); return; }

                // CREATE with initial link - Automatic Relationship
                const payload = {
                    name: famName,
                    initial_customer_id: selectedCustomer.id,
                    initial_relationship: 'Head' // Hardcoded as per request "remove that relationship too"
                };

                const res = await fetch(`${API_URL}/families`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (res.ok) {
                    Alert.alert("Success", `Family '${data.name}' created and linked!`);
                    setFamilyModalVisible(false);
                    fetchData();
                } else {
                    Alert.alert("Error", data.detail || "Failed to create");
                }
            } else {
                // ADD to existing
                if (!selectedFamily) { Alert.alert("Error", "Please select a family from search"); return; }
                if (!famRel) { Alert.alert("Error", "Enter relationship"); return; }

                const res = await fetch(`${API_URL}/customers/${selectedCustomer.id}/family`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        family_name: selectedFamily.name,
                        relationship: famRel
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    Alert.alert("Success", "Added to family successfully!");
                    setFamilyModalVisible(false);
                    fetchData();
                } else {
                    Alert.alert("Error", data.detail || "Failed to add");
                }
            }
        } catch (e) {
            Alert.alert("Error", "Network error");
        }
    };

    const toggleReveal = (id) => {
        setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const openEdit = (customer) => {
        setSelectedCustomer(customer);
        setEditName(customer.short_id || '');
        setEditModalVisible(true);
    };

    const saveEdit = () => {
        Alert.alert("Success", "Customer details updated.");
        setEditModalVisible(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'unattended': return theme.colors.danger;
            case 'attended': return theme.colors.success;
            case 'active': return theme.colors.info;
            default: return theme.colors.textSecondary;
        }
    };

    const filteredCustomers = customers.filter(c => {
        const statusData = customerStatuses[c.id];
        const status = statusData ? statusData.status : 'available';
        const sessionStatus = status === 'busy'; // true if busy, false if available

        let matchesFilter = true;
        if (filter === 'Active') matchesFilter = (status === 'busy');
        else if (filter === 'Unattended') matchesFilter = (status === 'available'); // Available means unattended
        else if (filter === 'Floating') matchesFilter = (c.is_floating && c.assigned_salesperson_id === user?.id);
        else if (filter === 'Attended') matchesFilter = (c.is_in_store && sessionStatus);
        else if (filter.startsWith('Floor')) {
            const floorNum = parseInt(filter.split(' ')[1]);
            matchesFilter = (c.current_floor === floorNum);
        }

        return matchesFilter && (c.short_id?.toLowerCase().includes(search.toLowerCase()) || c.id.toString().includes(search));
    });

    // Handle Assignment Alert
    useEffect(() => {
        const assigned = customers.find(c => c.is_floating && c.assigned_salesperson_id === user?.id && !customerStatuses[c.id]?.status === 'busy');
        if (assigned && assigned.id !== assignedAlert) {
            setAssignedAlert(assigned.id);
            Alert.alert(
                "New Assignment",
                `Customer ${assigned.short_id} has been assigned to you by CRE.`,
                [{ text: "View", onPress: () => setFilter('Floating') }]
            );
        }
    }, [customers, user?.id]);

    const renderCard = ({ item }) => {
        const isRevealed = revealedIds[item.id];

        const statusData = customerStatuses[item.id] || { status: 'available' };

        const isLocked = statusData.status === 'busy' && statusData.salesperson_id !== user?.id;
        const isMySession = statusData.status === 'busy' && statusData.salesperson_id === user?.id;
        const displayStatus = statusData.status === 'busy' ? 'Active' : 'Unattended';

        let uri = item.photo_url || 'https://via.placeholder.com/150';
        if (item.customer_jpg) {
            // Clean any whitespace/newlines
            const cleanB64 = item.customer_jpg.toString().replace(/[\s\r\n]+/g, '');
            if (cleanB64.length > 50) {
                if (cleanB64.startsWith('data:image')) {
                    uri = cleanB64;
                } else {
                    uri = `data:image/jpeg;base64,${cleanB64}`;
                }
            }
        }
        const imageSource = { uri };

        return (
            <View style={[styles.card, isLocked && { opacity: 0.8 }]}>
                {/* Photo Area */}
                <TouchableOpacity style={styles.imageContainer} onPress={() => toggleReveal(item.id)} activeOpacity={0.9}>
                    <Image
                        source={imageSource}
                        style={[styles.image, !isRevealed && styles.blurImage, { backgroundColor: '#e0e0e0' }]}
                        blurRadius={!isRevealed ? 20 : 0}
                        resizeMode="cover"
                    />
                    {!isRevealed && (
                        <View style={styles.overlay}>
                            <EyeOff size={32} color="white" />
                            <Text style={styles.tapText}>Tap to Identify</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Content Area */}
                <View style={styles.cardContent}>
                    <View style={styles.headerRow}>
                        <Text style={styles.shortId}>{item.short_id || `ID: ${item.id}`}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(displayStatus.toLowerCase() === 'active' ? 'active' : 'unattended') }]}>
                            <Text style={styles.statusText}>{displayStatus.toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Clock size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.infoText}>
                                {item.last_seen ? new Date(item.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <MapPin size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.infoText}>{item.current_floor || 'Unknown'}</Text>
                        </View>
                    </View>

                    {/* Family Tag if exists */}
                    {item.family_id && (
                        <View style={styles.familyTag}>
                            <Users size={14} color={theme.colors.primary} />
                            <Text style={styles.familyText}>Family ID: {item.family_id}</Text>
                        </View>
                    )}

                    {/* Lock Status Info */}
                    {isLocked && (
                        <View style={styles.lockInfo}>
                            <Lock size={14} color={theme.colors.danger} />
                            <Text style={styles.lockText}>Busy with {statusData.salesperson_name}</Text>
                        </View>
                    )}
                    {item.is_floating && item.assigned_salesperson_id === user?.id && (
                        <View style={[styles.lockInfo, { backgroundColor: 'rgba(212, 175, 55, 0.1)' }]}>
                            <Users size={14} color={theme.colors.primary} />
                            <Text style={[styles.lockText, { color: theme.colors.primary }]}>Assigned to You (Floating)</Text>
                        </View>
                    )}
                    {isMySession && (
                        <View style={styles.lockInfo}>
                            <RotateCw size={14} color={theme.colors.info} />
                            <Text style={[styles.lockText, { color: theme.colors.info }]}>Session Active (You)</Text>
                        </View>
                    )}

                    {/* Actions */}
                    <View style={styles.actions}>
                        {isMySession ? (
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: theme.colors.info }]}
                                onPress={() => navigation.navigate('ActiveSession', { customer: item })}
                            >
                                <RotateCw size={18} color="white" />
                                <Text style={styles.btnText}>RESUME</Text>
                            </TouchableOpacity>
                        ) : isLocked ? (
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: theme.colors.textSecondary }]}
                                disabled={true}
                            >
                                <Lock size={18} color="white" />
                                <Text style={styles.btnText}>BUSY</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: theme.colors.success }]}
                                onPress={() => navigation.navigate('ActiveSession', { customer: item })}
                            >
                                <Play size={18} color="white" />
                                <Text style={styles.btnText}>START SESSION</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
                            <Edit2 size={20} color={theme.colors.warning} />
                        </TouchableOpacity>

                        {/* Family Button */}
                        <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.colors.lightPrimary }]} onPress={() => openFamilyModal(item)}>
                            <Plus size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const filterTypes = ['All', 'Floor 1', 'Floor 2', 'Floor 3', 'Attended', 'Unattended', 'Floating'];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Customers</Text>
                <View style={styles.searchBar}>
                    <Search size={20} color={theme.colors.textSecondary} />
                    <TextInput
                        style={[styles.input, { color: theme.colors.text }]}
                        placeholder="Search ID..."
                        placeholderTextColor={theme.colors.textSecondary}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <View style={styles.filters}>
                {filterTypes.map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.chip, filter === f && styles.activeChip]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.chipText, filter === f && styles.activeChipText]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={filteredCustomers}
                    renderItem={renderCard}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.empty}>No customers found in DB.</Text>}
                />
            )}

            {/* Edit Modal */}
            <Modal
                transparent={true}
                visible={editModalVisible}
                animationType="fade"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Customer</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Customer Identifier / Name</Text>
                        <TextInput
                            style={styles.inputModal}
                            value={editName}
                            onChangeText={setEditName}
                        />

                        <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                            <Save size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Family Modal */}
            <Modal
                transparent={true}
                visible={familyModalVisible}
                animationType="slide"
                onRequestClose={() => setFamilyModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Family Management</Text>
                            <TouchableOpacity onPress={() => setFamilyModalVisible(false)}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        {/* Tabs */}
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tab, familyMode === 'create' && styles.activeTab]}
                                onPress={() => setFamilyMode('create')}>
                                <Text style={[styles.tabText, familyMode === 'create' && styles.activeTabText]}>Create New</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, familyMode === 'add' && styles.activeTab]}
                                onPress={() => setFamilyMode('add')}>
                                <Text style={[styles.tabText, familyMode === 'add' && styles.activeTabText]}>Add Member</Text>
                            </TouchableOpacity>
                        </View>

                        {familyMode === 'create' ? (
                            <>
                                <Text style={styles.inputLabel}>New Family Name (Auto-assigned)</Text>
                                <TextInput
                                    style={[styles.inputModal, { backgroundColor: '#f0f0f0', color: '#666' }]}
                                    value={famName}
                                    editable={false}
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.inputLabel}>Search Family</Text>
                                <TextInput
                                    style={styles.inputModal}
                                    placeholder="Type family name..."
                                    value={famSearch}
                                    onChangeText={(t) => {
                                        setFamSearch(t);
                                        setSelectedFamily(null); // clear selection on type
                                    }}
                                />

                                {/* Scrollable List of Families */}
                                <View style={styles.resultsListExpanded}>
                                    <FlatList
                                        data={famResults}
                                        keyExtractor={item => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={[styles.resultItem, selectedFamily?.id === item.id && styles.resultItemSelected]}
                                                onPress={() => {
                                                    setSelectedFamily(item);
                                                    setFamRel(''); // Reset rel input if changed
                                                }}
                                            >
                                                {/* Rep Image */}
                                                <Image
                                                    source={{ uri: item.representative_photo_url || 'https://via.placeholder.com/40' }}
                                                    style={styles.resultImage}
                                                />
                                                <View>
                                                    <Text style={[styles.resultTitle, selectedFamily?.id === item.id && { color: theme.colors.primary }]}>
                                                        {item.name}
                                                    </Text>
                                                    <Text style={styles.resultSub}>Started by {item.representative_short_id || 'Unknown'}</Text>
                                                </View>
                                                {selectedFamily?.id === item.id && <View style={styles.checkIcon}><Users size={16} color={theme.colors.primary} /></View>}
                                            </TouchableOpacity>
                                        )}
                                        ListEmptyComponent={<Text style={{ padding: 20, textAlign: 'center', color: '#999' }}>No families found.</Text>}
                                    />
                                </View>

                                {selectedFamily && (
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={styles.inputLabel}>Relationship to Family</Text>
                                        <TextInput
                                            style={styles.inputModal}
                                            placeholder="e.g. Wife, Son"
                                            value={famRel}
                                            onChangeText={setFamRel}
                                        />
                                    </View>
                                )}

                                {/* Remove old isolated Relationship Input */}
                            </>
                        )}

                        <TouchableOpacity style={styles.saveBtn} onPress={handleFamilyAction}>
                            {familyMode === 'create' ? <Plus size={20} color="white" /> : <Users size={20} color="white" />}
                            <Text style={styles.saveBtnText}>
                                {familyMode === 'create' ? " CREATE FAMILY" : " ADD TO FAMILY"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >
        </View >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 20, paddingTop: 60, backgroundColor: theme.colors.white },
    title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.text, marginBottom: 15 },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card,
        padding: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border
    },
    input: { marginLeft: 10, flex: 1, fontSize: 16 },

    filters: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10 },
    chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: theme.colors.card, marginRight: 10, borderWidth: 1, borderColor: theme.colors.border },
    activeChip: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: { color: theme.colors.textSecondary, fontWeight: '600' },
    activeChipText: { color: 'white' },

    listContent: { paddingHorizontal: 20, paddingVertical: 20 },

    // Card Styles
    card: {
        width: '100%', backgroundColor: theme.colors.white,
        borderRadius: 24, marginBottom: 20,
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        elevation: 5,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    imageContainer: { height: 250, backgroundColor: '#EEE', position: 'relative' },
    image: { width: '100%', height: '100%' },
    blurImage: { opacity: 0.8 },
    overlay: {
        ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center', alignItems: 'center'
    },
    tapText: { color: 'white', fontWeight: 'bold', marginTop: 10, fontSize: 16 },

    cardContent: { padding: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    shortId: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
    statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
    statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

    infoRow: { flexDirection: 'row', gap: 20, marginTop: 10 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    infoText: { color: theme.colors.textSecondary, fontSize: 16 },

    familyTag: {
        flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10,
        backgroundColor: theme.colors.lightPrimary, padding: 6, borderRadius: 6, alignSelf: 'flex-start'
    },
    familyText: { color: theme.colors.primary, fontSize: 14, fontWeight: '600' },

    lockInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: '#FFF5F5', padding: 8, borderRadius: 8 },
    lockText: { color: theme.colors.danger, fontWeight: '600', fontSize: 14 },

    actions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20 },
    btn: {
        flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingVertical: 14, borderRadius: 12, gap: 8
    },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    editBtn: {
        width: 50, height: 50, borderRadius: 12, backgroundColor: theme.colors.card,
        justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border
    },
    empty: { textAlign: 'center', marginTop: 50, color: theme.colors.textSecondary },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: theme.colors.white, borderRadius: 24, padding: 25 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    inputLabel: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 8, fontWeight: '600' },
    inputModal: {
        backgroundColor: theme.colors.card, padding: 15, borderRadius: 12,
        borderWidth: 1, borderColor: theme.colors.border, fontSize: 16, marginBottom: 20, color: theme.colors.text
    },
    saveBtn: {
        backgroundColor: theme.colors.primary, padding: 16, borderRadius: 12, alignItems: 'center',
        flexDirection: 'row', justifyContent: 'center', gap: 8
    },
    saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    // Tabs
    tabContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: theme.colors.card, borderRadius: 12, padding: 4 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: theme.colors.white, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    tabText: { color: theme.colors.textSecondary, fontWeight: '600' },
    activeTabText: { color: theme.colors.primary, fontWeight: 'bold' },

    readOnlyInput: {
        backgroundColor: '#f0f0f0', padding: 15, borderRadius: 12, marginBottom: 20,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ddd'
    },
    readOnlyText: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
    badge: { backgroundColor: theme.colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

    // Search Results
    resultsListExpanded: { height: 200, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 5, borderWidth: 1, borderColor: '#eee' },
    resultItemSelected: { backgroundColor: '#eef2ff', borderColor: theme.colors.primary, borderWidth: 1 },
    checkIcon: { marginLeft: 'auto' },
    resultItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    resultImage: { width: 36, height: 36, borderRadius: 18, marginRight: 10, backgroundColor: '#ddd' },
    resultTitle: { fontWeight: 'bold', fontSize: 14, color: theme.colors.text },
    resultSub: { fontSize: 12, color: theme.colors.textSecondary },

    selectedBadge: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: theme.colors.success, padding: 10, borderRadius: 8, marginBottom: 15
    },
    selectedText: { color: 'white', fontWeight: 'bold' }
});
