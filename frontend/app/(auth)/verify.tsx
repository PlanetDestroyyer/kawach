import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CameraView, Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { verifyUserImage } from "../../utils/api";

export default function VerifyScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<"front" | "back">("front");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          skipProcessing: true,
        });
        setCapturedImage(photo.uri);
      } catch (error) {
        Alert.alert("Error", "Failed to take picture. Please try again.");
      }
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const handleVerify = async () => {
    if (!capturedImage) {
      Alert.alert("Error", "Please take a photo first");
      return;
    }

    try {
      // Get user data from AsyncStorage
      const userProfileStr = await AsyncStorage.getItem("userProfile");
      if (!userProfileStr) {
        Alert.alert("Error", "User not found. Please log in again.");
        router.replace("/(auth)/login");
        return;
      }

      const userProfile = JSON.parse(userProfileStr);
      
      // Convert image to base64 for sending to backend
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Send verification request to backend
      const result = await verifyUserImage(userProfile._id, base64Image);
      
      if (result.success) {
        // Update verification status in AsyncStorage
        await AsyncStorage.setItem("isVerified", "true");
        
        Alert.alert(
          "Verification Complete",
          "Your identity has been verified successfully!",
          [
            { 
              text: "Continue", 
              onPress: () => router.replace("/tabs") 
            }
          ]
        );
      } else {
        Alert.alert("Error", result.data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Verification error:", error);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <MaterialIcons name="error" size={48} color="#f44336" />
        <Text style={styles.errorTitle}>Camera Access Required</Text>
        <Text style={styles.message}>
          Please enable camera permission in your device settings to complete verification.
        </Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => router.replace("/(auth)/register")}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Identity Verification</Text>
            <Text style={styles.subtitle}>
              Please take a selfie holding your Aadhar card
            </Text>
          </View>

          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={cameraType}
              onCameraReady={handleCameraReady}
            >
              <View style={styles.overlay}>
                <View style={styles.instructionBox}>
                  <MaterialIcons name="person" size={32} color="#fff" />
                  <Text style={styles.instructionText}>
                    Position your face in the circle
                  </Text>
                  <Text style={styles.instructionText}>
                    Hold Aadhar card next to your face
                  </Text>
                </View>
                
                <View style={styles.faceOutline} />
                
                <View style={styles.aadharInstruction}>
                  <MaterialIcons name="credit-card" size={24} color="#fff" />
                  <Text style={styles.aadharText}>
                    Aadhar card must be clearly visible
                  </Text>
                </View>
              </View>
            </CameraView>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setCameraType(cameraType === "back" ? "front" : "back")}
            >
              <MaterialIcons name="flip-camera-android" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={takePicture}
              disabled={!isCameraReady}
            >
              <View style={styles.captureInnerButton} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => router.replace("/(auth)/register")}
            >
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Your Photo</Text>
            <Text style={styles.subtitle}>
              Make sure your face and Aadhar card are clearly visible
            </Text>
          </View>

          <View style={styles.previewContainer}>
            <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          </View>

          <View style={styles.previewControls}>
            <TouchableOpacity 
              style={[styles.previewButton, styles.retakeButton]}
              onPress={retakePicture}
            >
              <MaterialIcons name="replay" size={24} color="#e5e5e5" />
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.previewButton, styles.verifyButton]}
              onPress={handleVerify}
            >
              <MaterialIcons name="check" size={24} color="#fff" />
              <Text style={styles.previewButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.demoContainer}>
        <Text style={styles.demoTitle}>Example</Text>
        <View style={styles.demoBox}>
          <MaterialIcons name="person-outline" size={48} color="#a0a0a0" />
          <View style={styles.demoAadhar}>
            <Text style={styles.demoAadharText}>Aadhar Card</Text>
          </View>
        </View>
        <Text style={styles.demoText}>
          Your face and Aadhar card should be clearly visible in the photo
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  header: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#a0a0a0",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#a0a0a0",
    textAlign: "center",
    marginHorizontal: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginTop: 16,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: "#5a3d7a",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 24,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 24,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    padding: 32,
  },
  instructionBox: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
    borderRadius: 16,
  },
  instructionText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  faceOutline: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
    alignSelf: "center",
    marginTop: 20,
  },
  aadharInstruction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
    borderRadius: 16,
  },
  aadharText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInnerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f44336",
  },
  previewContainer: {
    flex: 1,
    margin: 24,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  previewImage: {
    flex: 1,
    resizeMode: "contain",
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 24,
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retakeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  verifyButton: {
    backgroundColor: "#5a3d7a",
  },
  previewButtonText: {
    color: "#e5e5e5",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  demoContainer: {
    padding: 24,
    alignItems: "center",
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e5e5e5",
    marginBottom: 16,
  },
  demoBox: {
    width: 150,
    height: 150,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  demoAadhar: {
    position: "absolute",
    bottom: 20,
    right: 10,
    backgroundColor: "#5a3d7a",
    padding: 8,
    borderRadius: 8,
  },
  demoAadharText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  demoText: {
    color: "#a0a0a0",
    fontSize: 14,
    textAlign: "center",
  },
});