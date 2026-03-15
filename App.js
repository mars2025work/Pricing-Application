// App.js
import React from 'react';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from './src/theme/colors';

import MultiYearScreen from './src/screens/MultiYearScreen';
import ComparisonScreen from './src/screens/ComparisonScreen';
import HRScreen from './src/screens/HRScreen';
import ImplementationScreen from './src/screens/ImplementationScreen';
import SalesAnalysisScreen from './src/screens/SalesAnalysisScreen';

const Tab = createBottomTabNavigator();

// Simple icon renderer using emoji (no icon library required)
const TabIcon = ({ emoji, focused }) => (
  <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.6 }}>
    {emoji}
  </Text>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <NavigationContainer>
        {/* App Header */}
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            <Text style={styles.headerLogoText}>🧮</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>
              Odoo <Text style={{ color: Colors.secondaryLight }}>Pricing</Text> Studio
            </Text>
            <Text style={styles.headerSub}>
              <Text style={styles.liveDot}>●</Text> India Edition · GST 18%
            </Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>FY 2024–25</Text>
          </View>
        </View>

        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.gray,
            tabBarStyle: {
              backgroundColor: Colors.white,
              borderTopColor: Colors.border,
              borderTopWidth: 1,
              paddingBottom: 4,
              paddingTop: 4,
              height: 62,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '700',
              marginTop: 2,
            },
          }}>
          <Tab.Screen
            name="MultiYear"
            component={MultiYearScreen}
            options={{
              tabBarLabel: 'Multi-Year',
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="📋" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Comparison"
            component={ComparisonScreen}
            options={{
              tabBarLabel: 'Compare',
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="⚖️" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="HR"
            component={HRScreen}
            options={{
              tabBarLabel: 'HR Plans',
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="👔" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Implementation"
            component={ImplementationScreen}
            options={{
              tabBarLabel: 'Success Pack',
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="🛠️" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="SalesAnalysis"
            component={SalesAnalysisScreen}
            options={{
              tabBarLabel: 'Sales',
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="🎯" focused={focused} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoText: { fontSize: 20 },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  liveDot: { color: '#4ade80', fontSize: 8 },
  headerBadge: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  headerBadgeText: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },
});
