import React, { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userProfile = await AsyncStorage.getItem("userProfile");
        
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

    checkAuth();
  }, []);

  // Protect routes based on authentication status
  useEffect(() => {
    if (!authChecked) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "tabs";

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not in auth group, redirect to login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but in auth group, redirect to home
      router.replace("/tabs");
    } else if (isAuthenticated && !inTabsGroup && segments.length > 0) {
      // User is authenticated but not in tabs group, redirect to home
      router.replace("/tabs");
    }
  }, [isAuthenticated, segments, authChecked]);

  if (!authChecked) {
    return null;
  }

  return <Slot />;
}