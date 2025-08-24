import { Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="person" size={80} color="#9C27B0" />
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Your personal space</Text>
      <View style={styles.profileFeatures}>
        <Text style={styles.feature}>• Manage your collections</Text>
        <Text style={styles.feature}>• View your statistics</Text>
        <Text style={styles.feature}>• Customize your profile</Text>
        <Text style={styles.feature}>• Check your achievements</Text>
      </View>
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
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  profileFeatures: {
    marginTop: 20,
    alignItems: "flex-start",
  },
  feature: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  }
});