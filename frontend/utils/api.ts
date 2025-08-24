// Utility functions for API calls
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base URL for API calls
// For mobile apps, localhost won't work, so we use environment variables or a default IP
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.137.109:5000"; // Change this to your machine's IP

// Generic API call function with retry logic and better error handling
export async function apiCall(endpoint: string, options: RequestInit = {}, retries = 3) {
  try {
    // Get user token from AsyncStorage
    const token = await AsyncStorage.getItem("userToken");
    
    // Set default headers
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    // Log the request for debugging
    console.log(`API Request: ${BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers,
      body: options.body
    });
    
    // Make the API call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Log the response for debugging
    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    // Parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // Handle non-JSON responses
      const text = await response.text();
      data = { message: text || "Unexpected response format" };
    }
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Clear auth data and redirect to login
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userProfile");
      await AsyncStorage.removeItem("isVerified");
      // We can't redirect from here, but we can indicate the need to re-authenticate
    }
    
    // Return response data
    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error: any) {
    console.error("API call error:", error);
    
    // Handle timeout
    if (error.name === "AbortError") {
      console.log("API call timed out");
      return {
        success: false,
        status: 0,
        data: { message: "Request timed out. Please check your connection." },
        error,
      };
    }
    
    // Retry logic for network errors
    if (retries > 0 && (error instanceof TypeError)) {
      console.log(`Retrying API call... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      return apiCall(endpoint, options, retries - 1);
    }
    
    // Handle network errors
    return {
      success: false,
      status: 0,
      data: { message: "Network error. Please check your connection and API URL configuration." },
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

// Emergency Services API functions
export async function sendSOS(location: any, message: string) {
  return apiCall("/api/emergency/sos", {
    method: "POST",
    body: JSON.stringify({ location, message }),
  });
}

export async function sendLocationToContacts(location: any) {
  return apiCall("/api/emergency/send-location", {
    method: "POST",
    body: JSON.stringify({ location }),
  });
}

export async function getTrustedContacts() {
  return apiCall("/api/contacts");
}

export async function updateTrustedContact(contactId: string, contactData: any) {
  return apiCall(`/api/contacts/${contactId}`, {
    method: "PUT",
    body: JSON.stringify(contactData),
  });
}

export async function deleteTrustedContact(contactId: string) {
  return apiCall(`/api/contacts/${contactId}`, {
    method: "DELETE",
  });
}

// Incident Reporting API functions
export async function reportIncident(incidentData: any) {
  return apiCall("/api/incidents", {
    method: "POST",
    body: JSON.stringify(incidentData),
  });
}

export async function getIncidentHistory() {
  return apiCall("/api/incidents/history");
}

// Safety Tips API functions
export async function getSafetyTips(category?: string) {
  const endpoint = category ? `/api/tips?category=${category}` : "/api/tips";
  return apiCall(endpoint);
}

// Community API functions
export async function getCommunityPosts() {
  return apiCall("/api/community/posts");
}

export async function createCommunityPost(postData: any) {
  return apiCall("/api/community/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
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

// Health check
export async function healthCheck() {
  return apiCall("/api/health");
}

// Test endpoint
export async function testConnection() {
  return apiCall("/api/test");
}