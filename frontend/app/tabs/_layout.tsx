import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

// Custom tab bar icon component for consistent sizing
const TabBarIcon = ({ name, color }: { name: string; color: string }) => (
  <MaterialIcons 
    name={name as any} 
    color={color} 
    size={28} 
    style={{ 
      textAlign: 'center',
      width: 28,
      height: 28,
      lineHeight: 28,
    }} 
  />
);

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
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          paddingHorizontal: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarItemStyle: {
          padding: 0,
          margin: 0,
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
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarLabel: "Community",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="people" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: "SOS",
          tabBarLabel: "SOS",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="error" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="service"
        options={{
          title: "Services",
          tabBarLabel: "Services",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="support-agent" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="safety_poll"
        options={{
          title: "Safety Poll",
          tabBarLabel: "Poll",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="poll" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});