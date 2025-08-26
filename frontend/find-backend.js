#!/usr/bin/env node

// Script to help find the backend server on the local network
console.log("Searching for Kawach backend on local network...");

// Common IP ranges for local networks
const commonIPs = [
  "192.168.0.102",  // Your current backend IP
  "192.168.1.100",
  "192.168.0.100",
  "10.0.0.100",
  "172.16.0.100"
];

const port = 5000;

// Test function to check if backend is accessible
async function testIP(ip) {
  try {
    const response = await fetch(`http://${ip}:${port}/api/test`, {
      method: 'GET',
      timeout: 3000
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === "success") {
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Main function to find backend
async function findBackend() {
  for (const ip of commonIPs) {
    console.log(`Testing IP: ${ip}`);
    if (await testIP(ip)) {
      console.log(`✅ Backend found at: http://${ip}:${port}`);
      console.log(`Update your .env file to use this URL:`);
      console.log(`EXPO_PUBLIC_API_URL=http://${ip}:${port}`);
      return;
    }
  }
  
  console.log("❌ Backend not found on common IP addresses");
  console.log("Please make sure:");
  console.log("1. The backend server is running");
  console.log("2. Both devices are on the same network");
  console.log("3. The firewall allows connections on port 5000");
  console.log("4. Try manually entering your backend machine's IP address");
}

findBackend();