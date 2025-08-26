// IP detection utility for finding the backend server
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to detect the backend IP address
export async function detectBackendIP() {
  // Check if we're using the special 0.0.0.0 placeholder
  const envURL = process.env.EXPO_PUBLIC_API_URL;
  if (envURL === "http://0.0.0.0:5000") {
    // Try to detect the actual IP automatically
    return await findActualBackendIP();
  }
  
  // First check if we have a cached IP
  const cachedIP = await AsyncStorage.getItem('backendIP');
  if (cachedIP) {
    console.log(`Using cached backend IP: ${cachedIP}`);
    return cachedIP;
  }

  // If environment variable is set and not the placeholder, use it
  if (envURL) {
    console.log(`Using environment URL: ${envURL}`);
    return envURL;
  }

  // Try to detect the actual IP automatically
  return await findActualBackendIP();
}

// Function to find the actual backend IP automatically
async function findActualBackendIP() {
  // Common local IP address ranges for backend servers
  const commonIPs = [
    "192.168.0.102",  // Your actual IP
    "192.168.1.100",
    "192.168.0.100",
    "10.0.0.100",
    "172.16.0.100"
  ];

  const port = "5000";
  const testEndpoint = "/api/test";

  // Try each IP address
  for (const ip of commonIPs) {
    try {
      console.log(`Testing backend at: http://${ip}:${port}`);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`http://${ip}:${port}${testEndpoint}`, {
        method: "GET",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          console.log(`✅ Found backend at: http://${ip}:${port}`);
          // Cache the IP for future use
          await AsyncStorage.setItem('backendIP', `http://${ip}:${port}`);
          return `http://${ip}:${port}`;
        }
      }
    } catch (error: any) {
      console.log(`IP ${ip} not accessible:`, error.message);
    }
  }

  // If no IP is found, return the default (will likely fail but provides clear error)
  console.log("❌ No backend IP found, using default");
  return "http://192.168.0.102:5000";
}

// Function to clear cached IP (useful if backend IP changes)
export async function clearCachedIP() {
  await AsyncStorage.removeItem('backendIP');
}

// Function to manually set backend IP
export async function setBackendIP(ip: string) {
  await AsyncStorage.setItem('backendIP', ip);
}