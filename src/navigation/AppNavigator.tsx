import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useColors } from '../hooks/useColorScheme';

// Auth Screens
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { SignupScreen } from '../screens/Auth/SignupScreen';

// App Screens
import { HomeScreen } from '../screens/Home/HomeScreen';
import { CreateMatchScreen } from '../screens/Match/CreateMatchScreen';
import { LiveScoringScreen } from '../screens/Match/LiveScoringScreen';
import { ScorecardScreen } from '../screens/Match/ScorecardScreen';
import { MatchesScreen } from '../screens/Match/MatchesScreen';
import { TeamsScreen } from '../screens/Teams/TeamsScreen';
import { TournamentsScreen } from '../screens/Tournaments/TournamentsScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  const icons: Record<string, string> = {
    Home: '🏏',
    Matches: '📋',
    Teams: '👥',
    Tournaments: '🏆',
    Profile: '👤',
  };

  return (
    <View style={tabStyles.icon}>
      <Text style={{ fontSize: focused ? 22 : 20 }}>{icons[name] || '📋'}</Text>
    </View>
  );
}

function HomeTabs() {
  const colors = useColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={route.name} focused={focused} color={color} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Teams"
        component={TeamsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Tournaments"
        component={TournamentsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const colors = useColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />

      {/* Main App */}
      <Stack.Screen
        name="MainTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />

      {/* Match Screens */}
      <Stack.Screen
        name="CreateMatch"
        component={CreateMatchScreen}
        options={{ title: 'Create Match' }}
      />
      <Stack.Screen
        name="LiveScoring"
        component={LiveScoringScreen}
        options={{ title: 'Live Scoring', headerBackVisible: false }}
      />
      <Stack.Screen
        name="Scorecard"
        component={ScorecardScreen}
        options={{ title: 'Scorecard' }}
      />
    </Stack.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
