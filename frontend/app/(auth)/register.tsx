import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerUser } from "../../utils/api";
import { useAuth } from "../_layout";

export default function RegisterScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    aadharNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return false;
    }
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.aadharNumber.trim()) {
      Alert.alert("Error", "Please enter your Aadhar card number");
      return false;
    }
    const cleanedAadhar = formData.aadharNumber.replace(/\s/g, "");
    if (cleanedAadhar.length !== 12 || !/^\d{12}$/.test(cleanedAadhar)) {
      Alert.alert("Error", "Aadhar number must be 12 digits");
      return false;
    }
    if (!formData.emergencyContactName.trim()) {
      Alert.alert("Error", "Please enter emergency contact name");
      return false;
    }
    if (!formData.emergencyContactPhone.trim()) {
      Alert.alert("Error", "Please enter emergency contact phone");
      return false;
    }
    // Simple phone validation (you might want to improve this)
    if (formData.emergencyContactPhone.replace(/\D/g, "").length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return false;
    }
    if (!formData.emergencyContactRelation) {
      Alert.alert("Error", "Please select relationship with emergency contact");
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      // Complete registration by calling backend API
      setLoading(true);
      setError(null);
      try {
        const result = await registerUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          aadhar_number: formData.aadharNumber.replace(/\s/g, ""),
          emergency_contact: {
            name: formData.emergencyContactName.trim(),
            phone: formData.emergencyContactPhone.trim(),
            relation: formData.emergencyContactRelation
          }
        });

        if (result.success) {
          // Store user data and token
          await AsyncStorage.setItem("userToken", result.data.token || "temp-token");
          await AsyncStorage.setItem("userProfile", JSON.stringify(result.data.user));
          await AsyncStorage.setItem("isVerified", "false");
          
          // Update authentication state
          setIsAuthenticated(true);
          
          setLoading(false);
          
          Alert.alert(
            "Registration Complete",
            "Your account has been created successfully!",
            [
              { 
                text: "OK", 
                onPress: () => router.replace("/(auth)/verify") 
              }
            ]
          );
        } else {
          setLoading(false);
          const errorMessage = result.data.message || "Registration failed. Please try again.";
          setError(errorMessage);
          Alert.alert("Error", errorMessage);
        }
      } catch (error: any) {
        setLoading(false);
        const errorMessage = error.message || "Network error. Please try again.";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
        console.error("Registration error:", error);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const formatAadharNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 12);
    const parts = [];
    for (let i = 0; i < limited.length; i += 4) {
      parts.push(limited.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleAadharChange = (value: string) => {
    const formatted = formatAadharNumber(value);
    handleInputChange("aadharNumber", formatted);
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
          <Text style={styles.subtitle}>
            {currentStep === 1 ? "Create your safety profile" : "Complete your verification"}
          </Text>
          
          {/* Progress indicators */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, currentStep >= 1 && styles.activeDot]} />
            <View style={[styles.progressDot, currentStep >= 2 && styles.activeDot]} />
          </View>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error" size={20} color="#f44336" />
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        ) : null}

        {/* Registration Form */}
        <View style={styles.formCard}>
          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Personal Information</Text>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="person" size={20} color="#a0a0a0" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#a0a0a0"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange("name", value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={20} color="#a0a0a0" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#a0a0a0"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
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
                    value={formData.password}
                    onChangeText={(value) => handleInputChange("password", value)}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
                <Text style={styles.helperText}>At least 6 characters</Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={20} color="#a0a0a0" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#a0a0a0"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange("confirmPassword", value)}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
          )}

          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Verification & Emergency Contact</Text>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="credit-card" size={20} color="#a0a0a0" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Aadhar Card Number"
                    placeholderTextColor="#a0a0a0"
                    value={formData.aadharNumber}
                    onChangeText={handleAadharChange}
                    keyboardType="numeric"
                    maxLength={14}
                  />
                </View>
                <Text style={styles.helperText}>For identity verification and emergency services</Text>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Emergency Contact</Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="person" size={20} color="#a0a0a0" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Contact Name"
                    placeholderTextColor="#a0a0a0"
                    value={formData.emergencyContactName}
                    onChangeText={(value) => handleInputChange("emergencyContactName", value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="phone" size={20} color="#a0a0a0" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#a0a0a0"
                    value={formData.emergencyContactPhone}
                    onChangeText={(value) => handleInputChange("emergencyContactPhone", value)}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.selectContainer}>
                  <MaterialIcons name="people" size={20} color="#a0a0a0" style={styles.inputIcon} />
                  <View style={styles.selectWrapper}>
                    <Text style={formData.emergencyContactRelation ? styles.selectText : styles.placeholderText}>
                      {formData.emergencyContactRelation || "Select relationship"}
                    </Text>
                  </View>
                </View>
                <View style={styles.optionsContainer}>
                  {["Parent", "Spouse", "Sibling", "Friend", "Other"].map((relation) => (
                    <TouchableOpacity
                      key={relation}
                      style={styles.option}
                      onPress={() => handleInputChange("emergencyContactRelation", relation)}
                    >
                      <Text style={styles.optionText}>{relation}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.navButton, styles.backButton]} 
              onPress={handleBack}
              disabled={loading}
            >
              <MaterialIcons name="arrow-back" size={20} color="#e5e5e5" />
              <Text style={styles.navButtonText}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navButton, styles.nextButton, loading && styles.disabledButton]} 
              onPress={handleNext}
              disabled={loading}
            >
              <Text style={styles.navButtonText}>
                {loading ? (currentStep === 2 ? "Completing Setup..." : "Loading...") : 
                 (currentStep === 2 ? "Complete Setup" : "Continue")}
              </Text>
              {loading ? (
                <MaterialIcons name="hourglass-empty" size={20} color="#fff" />
              ) : (
                <MaterialIcons 
                  name={currentStep === 2 ? "check" : "arrow-forward"} 
                  size={20} 
                  color="#fff" 
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Access */}
        <TouchableOpacity 
          style={styles.emergencyButton} 
          onPress={() => {
            // Set temporary token for emergency access
            AsyncStorage.setItem("userToken", "emergency-access");
            AsyncStorage.setItem("userProfile", JSON.stringify({ name: "Emergency User", email: "emergency@example.com" }));
            AsyncStorage.setItem("isVerified", "false");
            setIsAuthenticated(true);
            router.replace("/tabs");
          }}
        >
          <MaterialIcons name="warning" size={20} color="#f44336" />
          <Text style={styles.emergencyButtonText}>Emergency Access (Skip Setup)</Text>
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
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 32,
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
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2a2a2a",
  },
  activeDot: {
    backgroundColor: "#5a3d7a",
  },
  formCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 24,
  },
  stepContainer: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e5e5",
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
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 26, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  selectWrapper: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
  },
  selectText: {
    fontSize: 16,
    color: "#e5e5e5",
  },
  placeholderText: {
    fontSize: 16,
    color: "#a0a0a0",
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
  helperText: {
    fontSize: 12,
    color: "#a0a0a0",
    marginTop: 6,
    marginLeft: 16,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e5e5e5",
  },
  optionsContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  optionText: {
    fontSize: 16,
    color: "#e5e5e5",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    flex: 1,
    marginRight: 8,
  },
  nextButton: {
    backgroundColor: "#5a3d7a",
    flex: 2,
    marginLeft: 8,
    justifyContent: "center",
  },
  navButtonText: {
    color: "#e5e5e5",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
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