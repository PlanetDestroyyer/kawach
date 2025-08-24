import { Text, View, StyleSheet, Image, LogBox } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";

// Ignore warnings in development
LogBox.ignoreAllLogs(true);

export default function HomeScreen() {
  useEffect(() => {
    console.log("HomeScreen mounted successfully");
  }, []);

  return (
    <View style={styles.container}>
      <MaterialIcons name="home" size={80} color="#4CAF50" />
      <Text style={styles.title}>Welcome to StickerSmash!</Text>
      <Text style={styles.subtitle}>Your ultimate sticker collection app</Text>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/images/react-logo.png')} 
          style={styles.image}
          resizeMode="contain"
          onError={(error) => {
            console.log("Image loading error:", error);
          }}
          onLoad={() => {
            console.log("Image loaded successfully");
          }}
        />
      </View>
      {/* Debug info */}
      <Text style={styles.debugText}>Debug: HomeScreen rendered</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  imageContainer: {
    marginTop: 20,
    width: 150,
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  debugText: {
    fontSize: 12,
    color: "#999",
    marginTop: 20,
  }
});
