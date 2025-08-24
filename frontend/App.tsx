import "expo-router/entry";

// Add global error handling
if (typeof ErrorUtils !== 'undefined') {
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error("Global error handler:", error, isFatal);
    // In a real app, you might want to send this to a logging service
  });
}

console.log("App.tsx loaded successfully");