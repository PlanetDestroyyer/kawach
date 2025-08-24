// Connection test utility
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function findCorrectIP() {
  // Common local IP address ranges
  const commonIPs = [
    "192.168.1.100",
    "192.168.0.100",
    "10.0.0.100",
    "172.16.0.100"
  ];
  
  const port = "5000";
  
  for (const ip of commonIPs) {
    try {
      console.log(`Testing IP: ${ip}`);
      const response = await fetch(`http://${ip}:${port}/api/test`, {
        method: "GET",
        timeout: 3000
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          console.log(`✅ Found working IP: ${ip}`);
          // Save to AsyncStorage
          await AsyncStorage.setItem("EXPO_PUBLIC_API_URL", `http://${ip}:${port}`);
          return `http://${ip}:${port}`;
        }
      }
    } catch (error) {
      console.log(`IP ${ip} not working:`, error.message);
    }
  }
  
  console.log("❌ No working IP found in common ranges");
  return null;
}

export async function testCurrentConnection() {
  const currentURL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.100:5000";
  console.log(`Testing current connection: ${currentURL}`);
  
  try {
    const response = await fetch(`${currentURL}/api/test`, {
      method: "GET",
      timeout: 5000
    });
    
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
  const currentURL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.100:5000";
  
  return {
    configuredURL: currentURL,
    timestamp: new Date().toISOString(),
    deviceInfo: {
      platform: require("react-native").Platform.OS,
      // Add more device info if needed
    }
  };
}