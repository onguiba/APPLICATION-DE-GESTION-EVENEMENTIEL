import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00D4AA',
        tabBarInactiveTintColor: '#4A5568',
        tabBarStyle: {
          backgroundColor: '#0D1117',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          paddingBottom: 12,
          paddingTop: 10,
          height: 72,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : styles.inactiveIcon}>
              <MaterialCommunityIcons name="view-dashboard" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Événements',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : styles.inactiveIcon}>
              <MaterialCommunityIcons name="calendar-month" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : styles.inactiveIcon}>
              <MaterialCommunityIcons name="wallet" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : styles.inactiveIcon}>
              <MaterialCommunityIcons name="account-circle" size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIcon: {
    backgroundColor: 'rgba(0, 212, 170, 0.12)',
    borderRadius: 10,
    padding: 6,
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveIcon: {
    padding: 6,
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
