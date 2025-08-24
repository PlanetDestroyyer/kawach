import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";

export default function TabLayout() {
  useEffect(() => {
    console.log("TabLayout mounted successfully");
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
        },
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#000",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarLabel: "Community",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="service"
        options={{
          title: "Service",
          tabBarLabel: "Service",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="build" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
