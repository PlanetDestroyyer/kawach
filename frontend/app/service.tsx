import { Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ServiceScreen() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="build" size={80} color="#FF9800" />
      <Text style={styles.title}>Services</Text>
      <Text style={styles.subtitle}>Our services for you</Text>
      <View style={styles.serviceList}>
        <Text style={styles.service}>• Sticker creation tools</Text>
        <Text style={styles.service}>• Collection management</Text>
        <Text style={styles.service}>• Trading platform</Text>
        <Text style={styles.service}>• Custom sticker printing</Text>
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
  serviceList: {
    marginTop: 20,
    alignItems: "flex-start",
  },
  service: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  }
});