import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e5e5e5",
        tabBarInactiveTintColor: "#a0a0a0",
        tabBarStyle: {
          backgroundColor: "#1a1a1a",
          borderTopWidth: 1,
          borderTopColor: "#2a2a2a",
        },
        headerStyle: {
          backgroundColor: "#1a1a1a",
        },
        headerTintColor: "#e5e5e5",
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
        name="sos"
        options={{
          title: "SOS",
          tabBarLabel: "SOS",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="warning" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="service"
        options={{
          title: "Services",
          tabBarLabel: "Services",
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