import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Modal,
    ScrollView,
    Alert,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Users,
    MapPin,
    Clock,
    Plus,
    X,
    CheckCircle2,
    AlertCircle,
    UserPlus,
    LayoutDashboard,
    Eye,
    History
} from 'lucide-react-native';
import axios from 'axios';
import { theme } from '../theme';
import { API_URL } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const CREDashboardScreen = () => {
    const { user } = useAuth();
    const [unattended, setUnattended] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [salespersons, setSalespersons] = useState([]);
    const [loadingSalespersons, setLoadingSalespersons] = useState(false);

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/cre/unattended_customers`);
            setUnattended(response.data);
        } catch (error) {
            console.error('Error fetching unattended customers:', error);
        }
    }, []);

    const [lastCount, setLastCount] = useState(0);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, [fetchData]);

    useEffect(() => {
        if (unattended.length > lastCount) {
            // New customer detected!
            Alert.alert(
                "New Customer",
                "A new unattended customer has been detected in the store.",
                [{ text: "OK" }]
            );
        }
        setLastCount(unattended.length);
    }, [unattended]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const handleAssignPress = async (customer) => {
        setSelectedCustomer(customer);
        setLoadingSalespersons(true);
        setShowAssignModal(true);
        try {
            // Assume we want salespersons on the same floor as the customer
            const response = await axios.get(`${API_URL}/cre/salespersons/${customer.current_floor || 'Floor 1'}`);
            setSalespersons(response.data);
        } catch (error) {
            console.error('Error fetching salespersons:', error);
            Alert.alert('Error', 'Could not fetch salespersons list');
        } finally {
            setLoadingSalespersons(false);
        }
    };

    const handleViewHistory = async (customer) => {
        setSelectedCustomer(customer);
        setShowHistoryModal(true);
        setLoadingHistory(true);
        try {
            const response = await axios.get(`${API_URL}/customers/${customer.id}/history`);
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const confirmAssignment = async (salespersonId) => {
        try {
            await axios.post(`${API_URL}/cre/assign`, {
                customer_id: selectedCustomer.id,
                salesperson_id: salespersonId
            });
            Alert.alert('Success', 'Salesperson assigned successfully');
            setShowAssignModal(false);
            fetchData();
        } catch (error) {
            console.error('Error assigning salesperson:', error);
            Alert.alert('Error', 'Assignment failed');
        }
    };

    const renderCustomerItem = ({ item }) => {
        const lastSeen = new Date(item.last_seen || item.first_seen);
        const diffSeconds = Math.floor((new Date() - lastSeen) / 1000);
        const isUrgent = diffSeconds > 30;

        return (
            <View style={styles.customerCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.imageOverlayContainer}>
                        <Image
                            source={{
                                uri: (item.customer_jpg && item.customer_jpg.length > 20)
                                    ? (item.customer_jpg.startsWith('http') || item.customer_jpg.startsWith('file')
                                        ? item.customer_jpg
                                        : (item.customer_jpg.startsWith('data:image')
                                            ? item.customer_jpg.replace(/[\s\r\n]+/g, '')
                                            : `data:image/jpeg;base64,${item.customer_jpg.replace(/[\s\r\n]+/g, '')}`))
                                    : 'https://via.placeholder.com/100'
                            }}
                            style={styles.customerImage}
                        />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.customerID}>{item.short_id || `ID: ${item.id}`}</Text>
                        <View style={styles.floorBadge}>
                            <MapPin size={12} color={theme.colors.primary} />
                            <Text style={styles.floorText}>{item.current_floor || 'Waiting Area'}</Text>
                        </View>
                        {item.family_id && (
                            <View style={[styles.floorBadge, { marginTop: 2 }]}>
                                <Users size={12} color={theme.colors.info} />
                                <Text style={[styles.floorText, { color: theme.colors.info }]}>Family #{item.family_id}</Text>
                            </View>
                        )}
                    </View>
                    <View style={[styles.timeBadge, isUrgent && styles.urgentBadge]}>
                        <Clock size={12} color={isUrgent ? '#ff4d4d' : theme.colors.textSecondary} />
                        <Text style={[styles.timeText, isUrgent && styles.urgentText]}>
                            {diffSeconds}s
                        </Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <TouchableOpacity
                        style={styles.historyButton}
                        onPress={() => handleViewHistory(item)}
                    >
                        <History size={18} color={theme.colors.textSecondary} />
                        <Text style={styles.historyButtonText}>History</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.assignButton}
                        onPress={() => handleAssignPress(item)}
                    >
                        <UserPlus size={18} color="#fff" />
                        <Text style={styles.assignButtonText}>Assign</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>CRE Portal</Text>
                    <Text style={styles.subtitle}>Floating Customers</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{unattended.length}</Text>
                        <Text style={styles.statLabel}>Waiting</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={unattended}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCustomerItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <CheckCircle2 size={48} color={theme.colors.success} style={{ marginBottom: 16 }} />
                        <Text style={styles.emptyText}>All customers are being attended!</Text>
                    </View>
                }
            />

            <Modal
                visible={showAssignModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Assign Salesperson</Text>
                            <TouchableOpacity onPress={() => setShowAssignModal(false)}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>
                            Select a salesperson for {selectedCustomer?.short_id} on {selectedCustomer?.current_floor}
                        </Text>

                        <ScrollView style={styles.salesmanList}>
                            {salespersons.map((s) => (
                                <TouchableOpacity
                                    key={s.id}
                                    style={[styles.salesmanItem, s.is_busy && styles.salesmanBusy]}
                                    disabled={s.is_busy}
                                    onPress={() => confirmAssignment(s.id)}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            source={{ uri: s.photo_url || 'https://via.placeholder.com/40' }}
                                            style={styles.salesmanAvatar}
                                        />
                                        <View style={styles.salesmanInfo}>
                                            <Text style={styles.salesmanName}>{s.full_name || s.username}</Text>
                                            <View style={styles.statusRow}>
                                                <View style={[styles.statusDot, { backgroundColor: s.is_busy ? '#ff4d4d' : '#4cd964' }]} />
                                                <Text style={styles.statusText}>{s.is_busy ? 'Busy' : 'Available'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {!s.is_busy && <Plus size={20} color={theme.colors.primary} />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showHistoryModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Session History</Text>
                            <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>Past sessions for {selectedCustomer?.short_id}</Text>

                        {loadingHistory ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} style={{ margin: 40 }} />
                        ) : (
                            <ScrollView style={styles.historyList}>
                                {history.length === 0 ? (
                                    <Text style={styles.emptyText}>No past history found.</Text>
                                ) : (
                                    history.map((session) => (
                                        <View key={session.session_id} style={styles.historyCard}>
                                            <View style={styles.historyHeader}>
                                                <Text style={styles.historyDate}>
                                                    {new Date(session.start_time).toLocaleDateString()} at {new Date(session.start_time).toLocaleTimeString()}
                                                </Text>
                                                <Text style={styles.historySalesman}>by {session.salesperson_name}</Text>
                                            </View>
                                            {session.details.map((detail, idx) => (
                                                <View key={idx} style={styles.historyDetail}>
                                                    <Text style={styles.historyJewel}>• {detail.jewel_name}</Text>
                                                    {detail.comments ? (
                                                        <Text style={styles.historyComment}>"{detail.comments}"</Text>
                                                    ) : null}
                                                </View>
                                            ))}
                                        </View>
                                    ))
                                )}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.colors.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
    },
    statBox: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    statLabel: {
        fontSize: 10,
        color: theme.colors.primary,
        textTransform: 'uppercase',
    },
    listContent: {
        padding: 16,
    },
    customerCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    customerImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#eee',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 16,
    },
    customerID: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    floorBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    floorText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginLeft: 4,
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    urgentBadge: {
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
    },
    timeText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginLeft: 4,
        fontWeight: '600',
    },
    urgentText: {
        color: '#ff4d4d',
    },
    cardFooter: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 16,
        flexDirection: 'row',
        gap: 12,
    },
    historyButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    historyButtonText: {
        color: theme.colors.textSecondary,
        fontWeight: '600',
        marginLeft: 8,
    },
    assignButton: {
        flex: 1.5,
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    assignButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    modalSubtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 20,
    },
    salesmanList: {
        marginBottom: 20,
    },
    salesmanItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    salesmanAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    salesmanBusy: {
        opacity: 0.5,
    },
    salesmanInfo: {
        flex: 1,
    },
    salesmanName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    historyList: {
        marginBottom: 20,
    },
    historyCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    historyDate: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: 'bold',
    },
    historySalesman: {
        fontSize: 12,
        color: theme.colors.primary,
    },
    historyDetail: {
        marginTop: 4,
    },
    historyJewel: {
        fontSize: 14,
        color: theme.colors.text,
    },
    historyComment: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
        marginLeft: 12,
        marginTop: 2,
    },
});

export default CREDashboardScreen;
