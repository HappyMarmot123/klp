import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { onAuthStateChanged, User } from "firebase/auth";
import "react-native-gesture-handler";

import { auth } from "./firebase.config";
import { RootStackParamList } from "./src/types";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import PostDetailScreen from "./src/screens/PostDetailScreen";
import CreatePostScreen from "./src/screens/CreatePostScreen";
import GradientBackground from "./src/presentation/components/layout/GradientBackground";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <GradientBackground>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>로딩 중...</Text>
            <StatusBar style="light" />
          </View>
        </GradientBackground>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GradientBackground>
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: "#4a90e2",
              background: "transparent",
              card: "transparent",
              text: "#ffffff",
              border: "rgba(255, 255, 255, 0.2)",
              notification: "#ff6b6b",
            },
            fonts: {
              regular: {
                fontFamily: "System",
                fontWeight: "normal",
              },
              medium: {
                fontFamily: "System",
                fontWeight: "500",
              },
              bold: {
                fontFamily: "System",
                fontWeight: "bold",
              },
              heavy: {
                fontFamily: "System",
                fontWeight: "900",
              },
            },
          }}
        >
          <Stack.Navigator
            initialRouteName={user ? "Home" : "Login"}
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              animationDuration: 300,
              gestureEnabled: true,
              gestureDirection: "horizontal",
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </GradientBackground>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
