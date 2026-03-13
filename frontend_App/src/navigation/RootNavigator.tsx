import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { useAppContext } from "../context/AppContext";
import { LandingScreen } from "../screens/LandingScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { SignupScreen } from "../screens/SignupScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { AssessmentScreen } from "../screens/AssessmentScreen";
import { PredictionScreen } from "../screens/PredictionScreen";
import { RoadmapScreen } from "../screens/RoadmapScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
};

type MainTabParamList = {
  Dashboard: undefined;
  Assessment: undefined;
  Prediction: undefined;
  Roadmap: undefined;
  Profile: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabParamList>();

function AppTabs() {
  return (
    <MainTabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#6b7280",
        tabBarLabelStyle: { fontSize: 11, marginBottom: 4 },
        tabBarStyle: { height: 64, paddingTop: 6, paddingBottom: 8 },
        tabBarIcon: ({ color, size }) => {
          const iconByRoute: Record<keyof MainTabParamList, React.ComponentProps<typeof Ionicons>["name"]> = {
            Dashboard: "grid-outline",
            Assessment: "clipboard-outline",
            Prediction: "analytics-outline",
            Roadmap: "map-outline",
            Profile: "person-circle-outline",
          };

          return <Ionicons name={iconByRoute[route.name]} size={size} color={color} />;
        },
      })}
    >
      <MainTabs.Screen name="Dashboard" component={DashboardScreen} />
      <MainTabs.Screen name="Assessment" component={AssessmentScreen} />
      <MainTabs.Screen name="Prediction" component={PredictionScreen} />
      <MainTabs.Screen name="Roadmap" component={RoadmapScreen} />
      <MainTabs.Screen name="Profile" component={ProfileScreen} />
    </MainTabs.Navigator>
  );
}

export function RootNavigator() {
  const { isHydrated, isLoggedIn } = useAppContext();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppTabs />
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: "#f8fafc" },
            headerTintColor: "#0f172a",
          }}
        >
          <AuthStack.Screen name="Landing" component={LandingScreen} options={{ title: "CareerPath" }} />
          <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
          <AuthStack.Screen name="Signup" component={SignupScreen} options={{ title: "Sign Up" }} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
