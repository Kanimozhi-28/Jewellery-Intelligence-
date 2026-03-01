import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, TextInput, ScrollView, Modal } from 'react-native';
import { theme } from '../theme';
import { useAuth, API_URL } from '../context/AuthContext';
import axios from 'axios';
import { Search, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react-native';

export default function HistoryScreen() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedSessionId, setExpandedSessionId] = useState(null);
    const [search, setSearch] = useState('');

    // Date Filter State
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        if (user?.id) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/history/salesperson/${user.id}`);
            setHistory(response.data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (sessionId) => {
        setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
    };

    // Filtering Logic
    const filteredHistory = history.filter(item => {
        // Search Filter
        const searchLower = search.toLowerCase();
        const idMatch = item.customer_short_id?.toLowerCase().includes(searchLower);
        const jewelMatch = item.details?.some(d => d.jewel_name.toLowerCase().includes(searchLower));
        const matchesSearch = !search || idMatch || jewelMatch;

        // Date Filter
        let matchesDate = true;
        if (selectedDate) {
            const itemDate = new Date(item.start_time);
            matchesDate = itemDate.toDateString() === selectedDate.toDateString();
        }

        return matchesSearch && matchesDate;
    });

    const renderItem = ({ item }) => {
        const isExpanded = expandedSessionId === item.session_id;
        const dateObj = new Date(item.start_time);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <TouchableOpacity style={styles.card} onPress={() => toggleExpand(item.session_id)} activeOpacity={0.8}>
                <View style={styles.cardHeader}>
                    <View style={styles.row}>
                        {/* Avatar */}
                        {item.customer_jpg ? (
                            <Image source={{ uri: item.customer_jpg }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Text style={styles.avatarText}>C</Text>
                            </View>
                        )}

                        {/* Main Info */}
                        <View style={styles.infoCol}>
                            <Text style={styles.customerId}>{item.customer_short_id || "Unknown ID"}</Text>
                            <Text style={styles.itemsShown}>{item.total_items} items shown</Text>
                        </View>
                    </View>

                    {/* Date/Time Right Aligned */}
                    <View style={styles.dateCol}>
                        <Text style={styles.dateText}>{dateStr}</Text>
                        <Text style={styles.timeText}>{timeStr}</Text>
                    </View>
                </View>

                {isExpanded && (
                    <View style={styles.detailsContainer}>
                        <View style={styles.divider} />
                        {item.details && item.details.length > 0 ? (
                            item.details.map((detail, index) => (
                                <View key={index} style={styles.detailRow}>
                                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(detail.action) }]} />
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.jewelHeader}>
                                            <Text style={styles.jewelName}>{detail.jewel_name}</Text>
                                            <Text style={[styles.actionTag, { color: getStatusColor(detail.action) }]}>
                                                {detail.action.toUpperCase()}
                                            </Text>
                                        </View>
                                        {detail.comments ? (
                                            <Text style={styles.commentText}>"{detail.comments}"</Text>
                                        ) : null}
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noDetailsText}>No interactions recorded.</Text>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const getStatusColor = (action) => {
        switch (action?.toLowerCase()) {
            case 'purchased': return theme.colors.success;
            case 'interested': return theme.colors.warning;
            default: return theme.colors.primary;
        }
    };

    // Calendar Helper Functions
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startingDay = firstDay.getDay(); // 0-6 (Sun-Sat)
        const totalDays = lastDay.getDate();

        const days = [];
        // Empty slots for days before start
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        // Days
        for (let i = 1; i <= totalDays; i++) {
            days.push(new Date(year, month, i));
        }

        // Fill remaining slots to maintain steady height (6 rows * 7 days = 42 slots)
        const totalSlots = 42;
        while (days.length < totalSlots) {
            days.push(null);
        }

        return days;
    };

    const changeMonth = (dir) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(currentMonth.getMonth() + dir);
        setCurrentMonth(newDate);
    };

    const selectDate = (date) => {
        setSelectedDate(date);
        setShowDatePicker(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>History</Text>

                {/* Search & Filter Row */}
                <View style={styles.filtersRow}>
                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Search size={18} color={theme.colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Customer / Jewel..."
                            placeholderTextColor={theme.colors.textSecondary}
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>

                    {/* Calendar Filter Button */}
                    <TouchableOpacity
                        style={[styles.filterBtn, selectedDate && styles.filterBtnActive]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <CalendarIcon size={20} color={selectedDate ? 'white' : theme.colors.textSecondary} />
                        {selectedDate && <Text style={styles.filterBtnTextActive}>{selectedDate.getDate()}/{selectedDate.getMonth() + 1}</Text>}
                    </TouchableOpacity>
                </View>

                {/* Active Filter Indicator */}
                {selectedDate && (
                    <View style={styles.activeFilterRow}>
                        <Text style={styles.activeFilterText}>
                            Showing results for: <Text style={{ fontWeight: 'bold' }}>{selectedDate.toDateString()}</Text>
                        </Text>
                        <TouchableOpacity onPress={() => setSelectedDate(null)} style={{ marginLeft: 10 }}>
                            <Text style={styles.clearText}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredHistory}
                    renderItem={renderItem}
                    keyExtractor={item => item.session_id.toString()}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No history found for this criteria.</Text>
                        </View>
                    }
                />
            )}

            {/* Custom Calendar Modal */}
            <Modal
                transparent={true}
                visible={showDatePicker}
                animationType="fade"
                onRequestClose={() => setShowDatePicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.calendarContainer}>
                        {/* Header */}
                        <View style={styles.calendarHeader}>
                            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navBtn}>
                                <ChevronLeft size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                            <Text style={styles.monthTitle}>
                                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </Text>
                            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navBtn}>
                                <ChevronRight size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        {/* Week Days */}
                        <View style={styles.weekRow}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <Text key={d} style={styles.weekDayText}>{d}</Text>
                            ))}
                        </View>

                        {/* Days Grid */}
                        <View style={styles.daysGrid}>
                            {generateCalendarDays().map((date, index) => (
                                <View key={index} style={styles.dayCell}>
                                    {date ? (
                                        <TouchableOpacity
                                            style={[
                                                styles.dayBtn,
                                                selectedDate?.toDateString() === date.toDateString() && styles.selectedDay
                                            ]}
                                            onPress={() => selectDate(date)}
                                        >
                                            <Text style={[
                                                styles.dayText,
                                                selectedDate?.toDateString() === date.toDateString() && styles.selectedDayText
                                            ]}>
                                                {date.getDate()}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowDatePicker(false)}>
                            <Text style={styles.closeModalText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 15, backgroundColor: theme.colors.white },
    headerTitle: { fontSize: 32, color: theme.colors.text, fontWeight: 'bold', marginBottom: 15 },

    filtersRow: { flexDirection: 'row', gap: 10 },
    searchContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5',
        paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: theme.colors.text },

    filterBtn: {
        width: 50, borderRadius: 12, backgroundColor: '#F0F2F5',
        justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 4
    },
    filterBtnActive: { backgroundColor: theme.colors.primary, width: 'auto', paddingHorizontal: 12 },
    filterBtnTextActive: { color: 'white', fontWeight: 'bold', fontSize: 12 },

    activeFilterRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    activeFilterText: { color: theme.colors.textSecondary, fontSize: 14 },
    clearText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 14 },

    list: { padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },

    // Card Styles
    card: {
        backgroundColor: theme.colors.white, borderRadius: 16,
        padding: 16, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
        borderWidth: 1, borderColor: '#EEE'
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    row: { flexDirection: 'row', alignItems: 'center' },

    avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: '#EEE' },
    avatarPlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E7FF' },
    avatarText: { fontSize: 18, color: theme.colors.primary, fontWeight: 'bold' },

    infoCol: { justifyContent: 'center' },
    customerId: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
    itemsShown: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },

    dateCol: { alignItems: 'flex-end' },
    dateText: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    timeText: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },

    // Details
    detailsContainer: { marginTop: 15 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 15 },
    detailRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
    statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, marginRight: 12 },
    jewelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    jewelName: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
    actionTag: { fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
    commentText: { fontSize: 13, fontStyle: 'italic', color: theme.colors.textSecondary, lineHeight: 18 },
    noDetailsText: { fontStyle: 'italic', color: theme.colors.textSecondary, marginLeft: 20 },
    emptyText: { color: theme.colors.textSecondary, fontSize: 16 },

    // Calendar Modal Styes
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    calendarContainer: { backgroundColor: 'white', borderRadius: 20, padding: 20 },
    calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    monthTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
    navBtn: { padding: 10 },
    weekRow: { flexDirection: 'row', marginBottom: 10 },
    weekDayText: { color: theme.colors.textSecondary, fontWeight: 'bold', width: '14.28%', textAlign: 'center' },
    daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
    dayBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    selectedDay: { backgroundColor: theme.colors.primary },
    dayText: { color: theme.colors.text, fontSize: 16 },
    selectedDayText: { color: 'white', fontWeight: 'bold' },
    closeModalBtn: { marginTop: 20, padding: 15, alignItems: 'center', backgroundColor: '#F0F2F5', borderRadius: 12 },
    closeModalText: { color: theme.colors.text, fontWeight: 'bold' }
});
