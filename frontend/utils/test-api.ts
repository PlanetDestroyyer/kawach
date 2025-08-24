// Test API connectivity
import { loginUser, registerUser, verifyUserImage } from "./api";

export async function testAPIConnection() {
  try {
    console.log("Testing API connection...");
    
    // Test health endpoint
    const healthResponse = await fetch("http://localhost:5000/api/health");
    const healthData = await healthResponse.json();
    console.log("Health check:", healthData);
    
    if (healthData.status === "healthy") {
      console.log("✅ API connection successful!");
      return true;
    } else {
      console.log("❌ API health check failed");
      return false;
    }
  } catch (error) {
    console.log("❌ API connection failed:", error);
    return false;
  }
}

// Export for use in other files
export default testAPIConnection;