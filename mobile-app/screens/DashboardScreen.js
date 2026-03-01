import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert, Dimensions } from 'react-native';
import { theme } from '../theme';
import { useAuth, API_URL } from '../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Bell, Users, UserCheck, UserX, Activity } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState([]);
    const [banner, setBanner] = useState(null);
    const [kpiData, setKpiData] = useState({ total: 0, attended: 0, unattended: 0, myActive: 0 });
    const [chartData, setChartData] = useState([]);
    const ws = useRef(null);

    // Fetch Initial Data
    useFocusEffect(
        React.useCallback(() => {
            fetchStats();
        }, [])
    );

    const fetchStats = async () => {
        if (!user?.id) return;
        try {
            // KPI
            const resKpi = await fetch(`${API_URL}/stats/kpi/${user.id}`);
            if (resKpi.ok) setKpiData(await resKpi.json());

            // Chart
            const resChart = await fetch(`${API_URL}/stats/weekly-activity/${user.id}`);
            if (resChart.ok) setChartData(await resChart.json());
        } catch (e) {
            console.error("Error fetching stats", e);
        }
    };

    useEffect(() => {
        const wsUrl = API_URL.replace('http', 'ws') + `/ws/${user.id}`;
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log('Connected to WebSocket');
            // Alert.alert("Debug", "WebSocket Connected!"); // Uncomment for debugging
        };
        ws.current.onerror = (e) => {
            console.log("WebSocket Error", e);
            Alert.alert("Connection Error", "Could not connect to Real-time server.");
        };
        ws.current.onmessage = (e) => {
            const message = JSON.parse(e.data);
            if (message.type === 'NEW_CUSTOMER' || message.type === 'ASSIGNED_CUSTOMER') {
                const newNotif = message.data;
                setNotifications(prev => [newNotif, ...prev]);
                setBanner(newNotif);
                setTimeout(() => setBanner(null), 5000);
                fetchStats(); // Refresh stats

                if (message.type === 'ASSIGNED_CUSTOMER') {
                    Alert.alert(
                        "New Assignment",
                        message.data.message || "A new customer has been assigned to you.",
                        [{ text: "View", onPress: () => navigation.navigate('Customers', { filter: 'Floating' }) }]
                    );
                }
            }
        };

        return () => ws.current?.close();
    }, [user.id]);

    const StatCard = ({ icon: Icon, label, value, color, onPress, subLabel }) => (
        <TouchableOpacity style={[styles.card, { borderColor: color }]} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Icon size={24} color={color} />
            </View>
            <View>
                <Text style={[styles.cardValue, { color }]}>{value}</Text>
                <Text style={styles.cardLabel}>{label}</Text>
                {subLabel && <Text style={styles.cardSubLabel}>{subLabel}</Text>}
            </View>
        </TouchableOpacity>
    );

    const WeeklyChart = ({ data }) => {
        if (!data || data.length === 0) return null;
        const maxVal = Math.max(...data.map(d => d.count), 5); // Default min height 5 scale

        return (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Weekly Activity (Sessions)</Text>
                <View style={styles.chartRow}>
                    {data.map((d, i) => {
                        const height = (d.count / maxVal) * 75; // Max 75% height to leave room for text
                        return (
                            <View key={i} style={styles.barContainer}>
                                <Text style={styles.barLabel}>{d.count > 0 ? d.count : ''}</Text>
                                <View style={[styles.bar, { height: `${Math.max(height, 4)}%`, backgroundColor: d.count > 0 ? theme.colors.primary : '#F7F7F7' }]} />
                                <Text style={styles.barDay}>{d.day}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Real-time Banner */}
            {banner && (
                <TouchableOpacity
                    style={styles.banner}
                    onPress={() => {
                        setBanner(null);
                        navigation.navigate('Customers');
                    }}
                >
                    <View style={styles.bannerContent}>
                        <Text style={styles.bannerTitle}>New Customer Detected!</Text>
                        <Text style={styles.bannerText}>ID: {banner.customer_short_id} • {banner.floor}</Text>
                    </View>
                    <Image
                        source={{
                            uri: (banner.customer_jpg && banner.customer_jpg.length > 10)
                                ? (banner.customer_jpg.startsWith('data:image') || banner.customer_jpg.startsWith('http') || banner.customer_jpg.startsWith('file')
                                    ? banner.customer_jpg
                                    : `data:image/jpeg;base64,${banner.customer_jpg}`)
                                : 'https://via.placeholder.com/50'
                        }}
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            )}

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.storeName}>DATA GOLD</Text>
                    <Text style={styles.date}>{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <View style={styles.profileHeader}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <TouchableOpacity style={styles.bellBtn}>
                        <Bell size={24} color={theme.colors.primary} />
                        {notifications.length > 0 && <View style={styles.badge} />}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* KPI Grid */}
                <View style={styles.grid}>
                    <StatCard
                        icon={Users}
                        label="In Store"
                        value={kpiData.total}
                        color={theme.colors.primary}
                        onPress={() => navigation.navigate('Customers')}
                    />
                    <StatCard
                        icon={UserCheck}
                        label="Attended"
                        value={kpiData.attended}
                        color={theme.colors.success}
                        onPress={() => navigation.navigate('Customers', { filter: 'Active' })}
                    />
                    <StatCard
                        icon={UserX}
                        label="Unattended"
                        value={kpiData.unattended}
                        color={theme.colors.danger}
                        onPress={() => navigation.navigate('Customers', { filter: 'Unattended' })} // Pass filter param
                        subLabel="Tap to View"
                    />
                    <StatCard
                        icon={Activity}
                        label="My Active Sessions"
                        value={kpiData.myActive}
                        color={theme.colors.info}
                        onPress={() => navigation.navigate('Customers', { filter: 'Active' })}
                    />
                </View>

                {/* NEW CHART */}
                <WeeklyChart data={chartData} />

                {/* Recent Notifications List */}
                <Text style={styles.sectionTitle}>Recent activity</Text>
                {notifications.length === 0 ? (
                    <Text style={styles.emptyText}>No recent alerts</Text>
                ) : (
                    notifications.map((n, i) => (
                        <View key={i} style={styles.notifItem}>
                            <View style={styles.notifIcon}>
                                <Bell size={16} color="white" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.notifTitle}>{n.customer_short_id} entered {n.floor}</Text>
                                <Text style={styles.notifTime}>{new Date(n.time_stamp || Date.now()).toLocaleTimeString()}</Text>
                            </View>
                        </View>
                    ))
                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        paddingTop: 60,
        paddingHorizontal: theme.spacing.l,
        paddingBottom: theme.spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    storeName: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary, letterSpacing: 1 },
    date: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 },
    profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    userName: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
    bellBtn: { position: 'relative' },
    badge: { position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.danger },

    banner: {
        position: 'absolute', top: 90, left: 20, right: 20, zIndex: 100,
        backgroundColor: theme.colors.primary, borderRadius: 12, padding: 15,
        flexDirection: 'row', alignItems: 'center', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', elevation: 10
    },
    bannerContent: { flex: 1 },
    bannerTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    bannerText: { color: 'white', fontSize: 14 },
    bannerImage: { width: 50, height: 50, borderRadius: 25, marginLeft: 10, backgroundColor: '#FFF' },

    content: { padding: theme.spacing.l },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 },
    card: {
        width: '48%', backgroundColor: theme.colors.white, borderRadius: 16, padding: 15,
        marginBottom: 15, borderWidth: 1, borderColor: theme.colors.border,
        boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', elevation: 2
    },
    iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    cardValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    cardLabel: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '500' },
    cardSubLabel: { fontSize: 10, color: theme.colors.textSecondary, marginTop: 5, fontStyle: 'italic' },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 15, marginTop: 10 },
    emptyText: { color: theme.colors.textSecondary, fontStyle: 'italic' },
    notifItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: theme.colors.card, padding: 10, borderRadius: 10 },
    notifIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    notifTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    notifTime: { fontSize: 12, color: theme.colors.textSecondary },

    // Chart Styles
    chartContainer: {
        backgroundColor: theme.colors.white, padding: 25, borderRadius: 24, marginBottom: 30,
        borderWidth: 1, borderColor: '#EAEAEA',
        elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05
    },
    chartTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 50, letterSpacing: 0.5 },
    chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 220, paddingHorizontal: 5 },
    barContainer: { alignItems: 'center', justifyContent: 'flex-end', height: '100%', flex: 1 },
    bar: { width: 12, borderRadius: 10, marginBottom: 12 },
    barLabel: { fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 8 },
    barDay: { fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary, marginTop: 12 }
});
