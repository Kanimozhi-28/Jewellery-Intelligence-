import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { theme } from '../theme';
import { Users, Plus, X, User } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../context/AuthContext';

export default function FamilyClustersScreen() {
    const [families, setFamilies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newFamilyName, setNewFamilyName] = useState('');
    const [search, setSearch] = useState('');

    // Member View Modal
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchFamilies();
        }, [])
    );

    const fetchFamilies = async () => {
        try {
            const res = await fetch(`${API_URL}/families`);
            if (res.ok) {
                const data = await res.json();
                setFamilies(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const addFamily = async () => {
        if (!newFamilyName.trim()) {
            Alert.alert("Error", "Please enter a family name");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/families`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newFamilyName })
            });
            const data = await res.json();
            if (res.ok) {
                Alert.alert("Success", "Family created");
                setNewFamilyName('');
                setModalVisible(false);
                fetchFamilies();
            } else {
                Alert.alert("Error", data.detail || "Failed to create");
            }
        } catch (e) {
            Alert.alert("Error", "Network Error");
        }
    };

    const openFamilyDetail = (family) => {
        setSelectedFamily(family);
        setViewModalVisible(true);
    };

    const renderMember = (member) => {
        let uri = member.photo_url || 'https://via.placeholder.com/150';
        if (member.customer_jpg) {
            const cleanB64 = member.customer_jpg.trim();
            if (cleanB64.startsWith('data:image')) {
                uri = cleanB64;
            } else {
                uri = `data:image/jpeg;base64,${cleanB64}`;
            }
        }

        return (
            <View key={member.id} style={styles.memberCard}>
                <Image source={{ uri }} style={styles.memberAvatar} />
                <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.short_id || `ID: ${member.id}`}</Text>
                    <Text style={styles.memberRel}>{member.family_relationship || 'Member'}</Text>
                </View>
                {member.is_in_store && (
                    <View style={styles.activeBadge}>
                        <Text style={styles.activeText}>IN STORE</Text>
                    </View>
                )}
            </View>
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => openFamilyDetail(item)}>
            <View style={styles.iconContainer}>
                <Users size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.members}>{item.members_count} Members</Text>
            </View>
            <View style={styles.arrow}>
                <Text style={{ color: theme.colors.textSecondary }}>{'>'}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Family Clusters</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                    <Plus size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Families..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>


            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={families.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.empty}>No family groups created yet.</Text>}
                />
            )}

            {/* Create Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Family Group</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Family Name (e.g. Smith Family)"
                            value={newFamilyName}
                            onChangeText={setNewFamilyName}
                        />

                        <TouchableOpacity style={styles.createBtn} onPress={addFamily}>
                            <Text style={styles.createBtnText}>CREATE GROUP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* View Members Modal */}
            <Modal
                visible={viewModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setViewModalVisible(false)}
            >
                <View style={[styles.container, { paddingTop: 20 }]}>
                    <View style={styles.detailHeader}>
                        <Text style={styles.detailTitle}>{selectedFamily?.name}</Text>
                        <TouchableOpacity onPress={() => setViewModalVisible(false)} style={styles.closeBtn}>
                            <X size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.detailSubtitle}>{selectedFamily?.members_count} Members</Text>

                    <ScrollView contentContainerStyle={styles.membersList}>
                        {selectedFamily?.members && selectedFamily.members.length > 0 ? (
                            selectedFamily.members.map(renderMember)
                        ) : (
                            <Text style={styles.empty}>No members added yet.</Text>
                        )}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 20, paddingTop: 60, backgroundColor: theme.colors.white
    },
    searchContainer: { paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.colors.white },
    searchInput: {
        backgroundColor: '#F0F2F5', padding: 12, borderRadius: 12, borderWidth: 1,
        borderColor: theme.colors.border, fontSize: 16, color: theme.colors.text
    },
    title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.text },
    addBtn: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.primary,
        justifyContent: 'center', alignItems: 'center', elevation: 5,
        boxShadow: '0px 4px 6px rgba(0,0,0,0.2)'
    },

    list: { padding: 20 },
    card: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.white,
        padding: 20, borderRadius: 16, marginBottom: 15,
        boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', elevation: 2, borderWidth: 1, borderColor: theme.colors.border
    },
    iconContainer: {
        width: 50, height: 50, borderRadius: 25, backgroundColor: theme.colors.card,
        justifyContent: 'center', alignItems: 'center', marginRight: 15
    },
    info: { flex: 1 },
    name: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
    members: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
    arrow: { padding: 10 },

    empty: { textAlign: 'center', marginTop: 50, color: theme.colors.textSecondary },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: theme.colors.white, borderRadius: 24, padding: 25 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    input: {
        backgroundColor: theme.colors.card, padding: 15, borderRadius: 12,
        borderWidth: 1, borderColor: theme.colors.border, fontSize: 16, marginBottom: 20
    },
    createBtn: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
    createBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    // Detail View
    detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
    detailTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text },
    detailSubtitle: { fontSize: 16, color: theme.colors.textSecondary, paddingHorizontal: 20, marginBottom: 20 },
    closeBtn: { padding: 10, borderRadius: 20, backgroundColor: theme.colors.card },

    membersList: { padding: 20 },
    memberCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.white,
        padding: 15, borderRadius: 16, marginBottom: 15,
        borderWidth: 1, borderColor: theme.colors.border,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
    },
    memberAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EEE', marginRight: 15 },
    memberInfo: { flex: 1 },
    memberName: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
    memberRel: { fontSize: 14, color: theme.colors.primary, marginTop: 2, fontWeight: '600' },
    activeBadge: { backgroundColor: theme.colors.success, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    activeText: { color: 'white', fontSize: 10, fontWeight: 'bold' }

});
