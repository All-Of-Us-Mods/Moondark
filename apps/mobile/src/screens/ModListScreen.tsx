import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { fetchMods } from "../api";
import type { Mod } from "@moondark/types";

export function ModListScreen({ navigation }: { navigation: any }) {
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMods()
      .then(setMods)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={mods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Stream", { modId: item.id, modName: item.name })
            }
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.game}>{item.game}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.version}>v{item.version}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0f",
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#16161e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e0e0e0",
    marginBottom: 4,
  },
  game: {
    fontSize: 14,
    color: "#6366f1",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    color: "#555",
  },
});
