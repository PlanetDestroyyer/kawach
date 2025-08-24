import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../../utils/api";
import { useAuth } from "../_layout";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    
    try {
      const result = await loginUser(email, password);
      
      if (result.success) {
        // Store token and user data
        await AsyncStorage.setItem("userToken", result.data.token);
        await AsyncStorage.setItem("userProfile", JSON.stringify(result.data.user));
        
        // Check if user is verified
        const isVerified = result.data.user.is_verified || false;
        await AsyncStorage.setItem("isVerified", isVerified.toString());
        
        // Update authentication state
        setIsAuthenticated(true);
        
        setLoading(false);
        
        // Redirect based on verification status
        if (isVerified) {
          router.replace("/tabs");
        } else {
          router.replace("/(auth)/verify");
        }
      } else {
        setLoading(false);
        Alert.alert("Error", result.data.message || "Login failed");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/(auth)/register");
  };

  const handleEmergencyAccess = () => {
    Alert.alert(
      "Emergency Access",
      "This will grant limited access to the app without authentication. Some features may be restricted.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Continue", 
          onPress: () => {
            // Set temporary token for emergency access
            AsyncStorage.setItem("userToken", "emergency-access");
            AsyncStorage.setItem("userProfile", JSON.stringify({ name: "Emergency User", email: "emergency@example.com" }));
            AsyncStorage.setItem("isVerified", "false");
            setIsAuthenticated(true);
            router.replace("/tabs");
          }
        }
      ]
    );
  };

  // Demo credentials for testing
  const useDemoCredentials = () => {
    setEmail("demo@example.com");
    setPassword("demopassword");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="shield" size={48} color="#5a3d7a" />
          </View>
          <Text style={styles.title}>SAFE GUARD</Text>
          <Text style={styles.subtitle}>Your Safety, Our Priority</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to your account</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#a0a0a0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#a0a0a0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#a0a0a0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#a0a0a0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.disabledButton]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>

          {/* Demo Credentials Button */}
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={useDemoCredentials}
          >
            <Text style={styles.demoButtonText}>Use Demo Credentials</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleRegisterRedirect}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Access */}
        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyAccess}>
          <MaterialIcons name="warning" size={20} color="#f44336" />
          <Text style={styles.emergencyButtonText}>Emergency Access (Skip Login)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0f0f0f",
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(90, 61, 122, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#a0a0a0",
  },
  formCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginBottom: 8,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 16,
    color: "#a0a0a0",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 26, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: "#e5e5e5",
  },
  loginButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5a3d7a",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#a0a0a0",
    marginRight: 8,
  },
  linkText: {
    color: "#5a3d7a",
    fontWeight: "600",
  },
  emergencyButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(244, 67, 54, 0.3)",
    borderRadius: 12,
  },
  emergencyButtonText: {
    color: "#f44336",
    fontWeight: "600",
    marginLeft: 8,
  },
});