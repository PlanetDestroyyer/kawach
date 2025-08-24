import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1a1a1a",
        },
        headerTintColor: "#e5e5e5",
        contentStyle: {
          backgroundColor: "#0f0f0f",
        },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: "Sign In",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: "Create Account",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="verify" 
        options={{ 
          title: "Verify Identity",
          headerShown: false,
        }} 
      />
    </Stack>
  );
}