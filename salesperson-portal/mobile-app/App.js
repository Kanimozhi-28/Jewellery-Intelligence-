import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LayoutDashboard, PlayCircle, UserCircle } from 'lucide-react-native';

import ZoneMonitorScreen from './src/screens/ZoneMonitorScreen';
import ActiveSessionScreen from './src/screens/ActiveSessionScreen';
import StatsScreen from './src/screens/StatsScreen';
import useAppStore from './src/store/useAppStore';

const Tab = createBottomTabNavigator();

export default function App() {
  const sessionId = useAppStore((state) => state.sessionId);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#1E3A8A',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarStyle: { paddingBottom: 5, height: 60 },
          }}
        >
          <Tab.Screen
            name="Zone Monitor"
            component={ZoneMonitorScreen}
            options={{
              tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
              title: "Zones"
            }}
          />
          <Tab.Screen
            name="Active Session"
            component={ActiveSessionScreen}
            options={{
              tabBarIcon: ({ color }) => <PlayCircle size={24} color={color} />,
              title: "Session",
              tabBarBadge: sessionId ? "1" : null
            }}
          />
          <Tab.Screen
            name="Profile"
            component={StatsScreen}
            options={{
              tabBarIcon: ({ color }) => <UserCircle size={24} color={color} />,
              title: "Stats"
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
