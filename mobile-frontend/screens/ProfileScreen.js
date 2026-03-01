import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Award, DollarSign } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    const InfoRow = ({ icon: Icon, label, value }) => (
        <View style={styles.row}>
            <View style={styles.iconContainer}>
                <Icon color={theme.colors.primary} size={24} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'Salesman'}</Text>
                    <Text style={styles.userRole}>{user?.role || 'Salesman'}</Text>
                </View>

                <View style={styles.statsContainer}>
                    <InfoRow icon={DollarSign} label="Today's Sales" value="$4,500" />
                    <InfoRow icon={Award} label="Monthly Target" value="85% Achieved" />
                    <InfoRow icon={User} label="Employee ID" value={`EMP-${user?.id || '001'}`} />
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <LogOut color={theme.colors.background} size={20} style={{ marginRight: 10 }} />
                    <Text style={styles.logoutText}>LOGOUT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: theme.spacing.l, paddingTop: 60, backgroundColor: theme.colors.card },
    headerTitle: { fontSize: 28, color: theme.colors.primary, fontWeight: 'bold' },
    content: { padding: theme.spacing.l, flex: 1 },
    avatarContainer: { alignItems: 'center', marginBottom: theme.spacing.xl },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
        borderWidth: 2,
        borderColor: theme.colors.primary
    },
    avatarText: { color: theme.colors.primary, fontSize: 40, fontWeight: 'bold' },
    userName: { color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginTop: 10 },
    userRole: { color: theme.colors.textSecondary, fontSize: 16 },
    statsContainer: { backgroundColor: theme.colors.white, borderRadius: 16, padding: theme.spacing.l, marginBottom: theme.spacing.xl, borderWidth: 1, borderColor: theme.colors.border },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.l },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m
    },
    label: { color: theme.colors.textSecondary, fontSize: 14 },
    value: { color: theme.colors.text, fontSize: 18, fontWeight: 'bold' },
    logoutButton: {
        backgroundColor: theme.colors.danger,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.m,
        borderRadius: 12
    },
    logoutText: { color: theme.colors.background, fontWeight: 'bold', fontSize: 16 }
});
