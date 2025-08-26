// Test API connectivity
import { healthCheck, testConnection } from "./api";
import { detectBackendIP } from "./ip-detection";

export async function testAPIConnection() {
  try {
    console.log("Testing API connection...");
    
    // Test health endpoint using our api utility
    const result = await healthCheck();
    
    if (result.success && result.data.status === "healthy") {
      console.log("✅ API connection successful!");
      console.log("Database status:", result.data.database);
      return true;
    } else {
      console.log("❌ API health check failed");
      console.log("Response:", result);
      return false;
    }
  } catch (error) {
    console.log("❌ API connection failed:", error);
    return false;
  }
}

// Test basic connectivity
export async function testBasicConnectivity() {
  const BASE_URL = await detectBackendIP();
  
  try {
    console.log(`Testing basic connectivity to ${BASE_URL}...`);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    // Test if we can reach the base URL
    const response = await fetch(BASE_URL, { 
      method: "HEAD",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Base URL response: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log("✅ Base URL is accessible");
      return true;
    } else {
      console.log("❌ Base URL is not accessible");
      return false;
    }
  } catch (error) {
    console.log("❌ Basic connectivity test failed:", error);
    return false;
  }
}

// Test authentication endpoints
export async function testAuthEndpoints() {
  try {
    console.log("Testing authentication endpoints...");
    
    // Test the test endpoint first
    const testResult = await testConnection();
    console.log("Test endpoint result:", testResult);
    
    if (testResult.success) {
      console.log("✅ Test endpoint accessible");
    } else {
      console.log("❌ Test endpoint not accessible");
    }
    
    // Get backend IP for testing auth endpoints
    const backendURL = await detectBackendIP();
    
    // Test login endpoint availability (not actual login)
    const controller1 = new AbortController();
    const timeoutId1 = setTimeout(() => controller1.abort(), 3000);
    
    const loginResponse = await fetch(`${backendURL}/api/login`, {
      method: "OPTIONS",
      signal: controller1.signal
    });
    
    clearTimeout(timeoutId1);
    
    if (loginResponse.ok) {
      console.log("✅ Login endpoint accessible");
    } else {
      console.log("❌ Login endpoint not accessible");
    }
    
    // Test register endpoint availability
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 3000);
    
    const registerResponse = await fetch(`${backendURL}/api/register`, {
      method: "OPTIONS",
      signal: controller2.signal
    });
    
    clearTimeout(timeoutId2);
    
    if (registerResponse.ok) {
      console.log("✅ Register endpoint accessible");
    } else {
      console.log("❌ Register endpoint not accessible");
    }
    
    return testResult.success && loginResponse.ok && registerResponse.ok;
  } catch (error) {
    console.log("❌ Authentication endpoints test failed:", error);
    return false;
  }
}

// Comprehensive connection test
export async function comprehensiveConnectionTest() {
  console.log("=== Comprehensive Connection Test ===");
  
  const basic = await testBasicConnectivity();
  const api = await testAPIConnection();
  const auth = await testAuthEndpoints();
  
  console.log("=== Test Results ===");
  console.log(`Basic Connectivity: ${basic ? "✅" : "❌"}`);
  console.log(`API Health Check: ${api ? "✅" : "❌"}`);
  console.log(`Auth Endpoints: ${auth ? "✅" : "❌"}`);
  
  if (basic && api && auth) {
    console.log("🎉 All tests passed! Connection is working properly.");
    return true;
  } else {
    console.log("⚠️  Some tests failed. Please check the logs above.");
    return false;
  }
}

// Export for use in other files
export default testAPIConnection;