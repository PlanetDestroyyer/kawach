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

// Heatmap API functions
export async function getHeatmapData() {
  // For now, we'll simulate the API call since we're focusing on the frontend
  // In a real implementation, this would connect to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock heatmap data for Pune
      const mockData = [
        {
          latitude: 18.5204,
          longitude: 73.8567,
          weight: 0.8,
          bubble_radius: 800,
          location_string: "FC Road",
          type: "crime"
        },
        {
          latitude: 18.5216,
          longitude: 73.8718,
          weight: 0.6,
          bubble_radius: 600,
          location_string: "Camp",
          type: "poll"
        },
        {
          latitude: 18.6404,
          longitude: 73.7917,
          weight: 0.9,
          bubble_radius: 1000,
          location_string: "Chinchwad",
          type: "news"
        },
        {
          latitude: 18.5642,
          longitude: 73.9077,
          weight: 0.3,
          bubble_radius: 400,
          location_string: "Koregaon Park",
          type: "poll"
        },
        {
          latitude: 18.5074,
          longitude: 73.8077,
          weight: 0.7,
          bubble_radius: 700,
          location_string: "Warje",
          type: "crime"
        }
      ];
      
      resolve({
        success: true,
        data: mockData
      });
    }, 1000);
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

// Safety Poll API functions
export async function submitSafetyPoll(pollData: any) {
  // For now, we'll simulate the API call since we're focusing on the frontend
  // In a real implementation, this would connect to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          message: "Safety poll submitted successfully"
        }
      });
    }, 1000);
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