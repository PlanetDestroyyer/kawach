import React, { useEffect, useState, createContext, useContext } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a context for authentication
const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  checkAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userProfile = await AsyncStorage.getItem("userProfile");
      const isVerified = await AsyncStorage.getItem("isVerified");
      
      if (token && userProfile) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.log("Auth check error:", e);
      setIsAuthenticated(false);
    }
    setAuthChecked(true);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Protect routes based on authentication status
  useEffect(() => {
    if (!authChecked) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "tabs";
    const inVerifyScreen = segments[1] === "verify";

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not in auth group, redirect to login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup && !inVerifyScreen) {
      // User is authenticated but in auth group (except verify screen), redirect to home
      router.replace("/tabs");
    } else if (isAuthenticated && !inTabsGroup && segments.length > 0 && segments[0] !== "(auth)") {
      // User is authenticated but not in tabs group, redirect to home
      router.replace("/tabs");
    }
  }, [isAuthenticated, segments, authChecked]);

  if (!authChecked) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, checkAuth }}>
      <Slot />
    </AuthContext.Provider>
  );
}