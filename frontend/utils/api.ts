// Utility functions for API calls
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base URL for API calls
const BASE_URL = "http://localhost:5000";

// Generic API call function
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    // Get user token from AsyncStorage
    const token = await AsyncStorage.getItem("userToken");
    
    // Set default headers
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    // Make the API call
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // Parse JSON response
    const data = await response.json();
    
    // Return response data
    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    // Handle network errors
    return {
      success: false,
      status: 0,
      data: { message: "Network error. Please check your connection." },
      error,
    };
  }
}

// Authentication API functions
export async function loginUser(email: string, password: string) {
  return apiCall("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(userData: any) {
  return apiCall("/api/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function verifyUserImage(userId: string, imageData: string) {
  return apiCall("/api/verify-image", {
    method: "POST",
    body: JSON.stringify({ 
      user_id: userId, 
      image_data: imageData 
    }),
  });
}

export async function getVerificationStatus(userId: string) {
  return apiCall(`/api/verification-status/${userId}`);
}

// Check if user is authenticated
export async function isAuthenticated() {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const userProfile = await AsyncStorage.getItem("userProfile");
    return !!(token && userProfile);
  } catch (e) {
    return false;
  }
}

// Logout function
export async function logout() {
  try {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userProfile");
    await AsyncStorage.removeItem("isVerified");
    return true;
  } catch (e) {
    console.error("Logout error:", e);
    return false;
  }
}