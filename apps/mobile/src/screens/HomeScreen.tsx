import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moondark</Text>
      <Text style={styles.subtitle}>Cloud-powered modding</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Mods")}
      >
        <Text style={styles.buttonText}>Browse Mods</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0f",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#e0e0e0",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#888",
    marginBottom: 48,
  },
  button: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
