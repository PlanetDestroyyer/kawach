// Connection test utility
import AsyncStorage from "@react-native-async-storage/async-storage";
import { detectBackendIP } from "./ip-detection";

export async function findCorrectIP() {
  console.log("Detecting backend IP address...");
  const backendURL = await detectBackendIP();
  
  if (backendURL && !backendURL.includes("0.0.0.0")) {
    console.log(`✅ Using backend URL: ${backendURL}`);
    return backendURL;
  } else {
    console.log("❌ Could not detect backend IP automatically");
    return null;
  }
}

export async function testCurrentConnection() {
  const currentURL = await detectBackendIP();
  console.log(`Testing current connection: ${currentURL}`);
  
  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${currentURL}/api/test`, {
      method: "GET",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Current connection is working:", data);
      return true;
    } else {
      console.log("❌ Current connection failed with status:", response.status);
      return false;
    }
  } catch (error: any) {
    console.log("❌ Current connection failed with error:", error.message);
    return false;
  }
}

export async function getConnectionInfo() {
  const currentURL = await detectBackendIP();
  
  return {
    configuredURL: currentURL,
    timestamp: new Date().toISOString(),
    deviceInfo: {
      platform: require("react-native").Platform.OS,
      // Add more device info if needed
    }
  };
}