import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform, ActivityIndicator } from "react-native";
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRelationOptions, setShowRelationOptions] = useState(false);
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  // Relationship options
  const relationOptions = [
    "Parent",
    "Spouse",
    "Sibling",
    "Child",
    "Friend",
    "Colleague",
    "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = "Aadhar card number is required";
    } else {
      const cleanedAadhar = formData.aadharNumber.replace(/\s/g, "");
      if (cleanedAadhar.length !== 12 || !/^\d{12}$/.test(cleanedAadhar)) {
        newErrors.aadharNumber = "Aadhar number must be 12 digits";
      }
    }
    
    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = "Emergency contact name is required";
    }
    
    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = "Emergency contact phone is required";
    } else if (formData.emergencyContactPhone.replace(/\D/g, "").length < 10) {
      newErrors.emergencyContactPhone = "Please enter a valid phone number";
    }
    
    if (!formData.emergencyContactRelation) {
      newErrors.emergencyContactRelation = "Please select relationship with emergency contact";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      // Complete registration by calling backend API
      setLoading(true);
      setErrors({});
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
          setErrors({ general: errorMessage });
        }
      } catch (error: any) {
        setLoading(false);
        const errorMessage = error.message || "Network error. Please try again.";
        setErrors({ general: errorMessage });
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
        {errors.general ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error" size={20} color="#f44336" />
            <Text style={styles.errorMessage}>{errors.general}</Text>
          </View>
        ) : null}

        {/* Registration Form */}
        <View style={styles.formCard}>
          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Personal Information</Text>
              
              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.name && styles.inputError]}>
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
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.email && styles.inputError]}>
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
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.password && styles.inputError]}>
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
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                <Text style={styles.helperText}>At least 6 characters</Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
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
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
              </View>
            </View>
          )}

          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Verification & Emergency Contact</Text>
              
              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.aadharNumber && styles.inputError]}>
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
                {errors.aadharNumber ? <Text style={styles.errorText}>{errors.aadharNumber}</Text> : null}
                <Text style={styles.helperText}>For identity verification and emergency services</Text>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Emergency Contact</Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.emergencyContactName && styles.inputError]}>
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
                {errors.emergencyContactName ? <Text style={styles.errorText}>{errors.emergencyContactName}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.emergencyContactPhone && styles.inputError]}>
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
                {errors.emergencyContactPhone ? <Text style={styles.errorText}>{errors.emergencyContactPhone}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <View style={[styles.selectContainer, errors.emergencyContactRelation && styles.inputError]}>
                  <MaterialIcons name="people" size={20} color="#a0a0a0" style={styles.inputIcon} />
                  <TouchableOpacity 
                    style={styles.selectWrapper}
                    onPress={() => setShowRelationOptions(!showRelationOptions)}
                  >
                    <Text style={formData.emergencyContactRelation ? styles.selectText : styles.placeholderText}>
                      {formData.emergencyContactRelation || "Select relationship"}
                    </Text>
                    <MaterialIcons 
                      name={showRelationOptions ? "arrow-drop-up" : "arrow-drop-down"} 
                      size={24} 
                      color="#a0a0a0" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.emergencyContactRelation ? <Text style={styles.errorText}>{errors.emergencyContactRelation}</Text> : null}
                
                {showRelationOptions && (
                  <View style={styles.optionsContainer}>
                    {relationOptions.map((relation) => (
                      <TouchableOpacity
                        key={relation}
                        style={styles.option}
                        onPress={() => {
                          handleInputChange("emergencyContactRelation", relation);
                          setShowRelationOptions(false);
                        }}
                      >
                        <Text style={styles.optionText}>{relation}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
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
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.navButtonText}>
                    {currentStep === 2 ? "Completing Setup..." : "Loading..."}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.navButtonText}>
                    {currentStep === 2 ? "Complete Setup" : "Continue"}
                  </Text>
                  <MaterialIcons 
                    name={currentStep === 2 ? "check" : "arrow-forward"} 
                    size={20} 
                    color="#fff" 
                  />
                </>
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  errorMessage: {
    color: "#f44336",
    marginLeft: 8,
    fontSize: 14,
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
  inputError: {
    borderColor: "#f44336",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingRight: 16,
    paddingLeft: 8,
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
    paddingLeft: 8,
    fontSize: 16,
    color: "#e5e5e5",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 16,
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
    borderWidth: 1,
    borderColor: "#3a3a3a",
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
  disabledButton: {
    opacity: 0.7,
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