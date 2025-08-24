import { Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="people" size={80} color="#2196F3" />
      <Text style={styles.title}>Community</Text>
      <Text style={styles.subtitle}>Connect with other users</Text>
      <View style={styles.featureList}>
        <Text style={styles.feature}>• Share your sticker collections</Text>
        <Text style={styles.feature}>• Join themed groups</Text>
        <Text style={styles.feature}>• Participate in challenges</Text>
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
  featureList: {
    marginTop: 20,
    alignItems: "flex-start",
  },
  feature: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  }
});