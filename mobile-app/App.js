import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { theme } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import CustomersScreen from './screens/CustomersScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ActiveSessionScreen from './screens/ActiveSessionScreen';
import FamilyClustersScreen from './screens/FamilyClustersScreen';
import CREDashboardScreen from './screens/CREDashboardScreen';

// Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import { LayoutDashboard, Users, History, User, Network, ShieldCheck } from 'lucide-react-native';

function AppTabs() {
    const { user } = useAuth();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.card,
                    borderTopColor: theme.colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarIcon: ({ color, size }) => {
                    let IconComponent = LayoutDashboard; // Default

                    if (route.name === 'Dashboard') IconComponent = LayoutDashboard;
                    else if (route.name === 'CRE Dashboard') IconComponent = ShieldCheck;
                    else if (route.name === 'Customers') IconComponent = Users;
                    else if (route.name === 'Family') IconComponent = Network; // New Icon
                    else if (route.name === 'History') IconComponent = History;
                    else if (route.name === 'Profile') IconComponent = User;

                    return <IconComponent size={size} color={color} />;
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600'
                }
            })}
        >
            {user?.role === 'cre' ? (
                <Tab.Screen name="CRE Dashboard" component={CREDashboardScreen} />
            ) : (
                <Tab.Screen name="Dashboard" component={DashboardScreen} />
            )}
            <Tab.Screen name="Customers" component={CustomersScreen} />
            <Tab.Screen name="Family" component={FamilyClustersScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

function Navigation() {
    const { user } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    <>
                        <Stack.Screen name="Main" component={AppTabs} />
                        <Stack.Screen name="ActiveSession" component={ActiveSessionScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <StatusBar style="light" />
                <Navigation />
            </AuthProvider>
        </SafeAreaProvider>
    );
}
