import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import type { RouteProp } from "@react-navigation/native";
import { createSession, fetchSession } from "../api";

type StreamRouteProp = RouteProp<
  { Stream: { modId: string; modName: string } },
  "Stream"
>;

export function StreamScreen({
  route,
  navigation,
}: {
  route: StreamRouteProp;
  navigation: any;
}) {
  const { modId, modName } = route.params;
  const [status, setStatus] = useState<"launching" | "connecting" | "streaming" | "error">("launching");
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    createSession("user-demo", modId)
      .then(async (session) => {
        setSessionId(session.id);
        let current = session;
        while (current.status === "pending") {
          await new Promise((r) => setTimeout(r, 1000));
          current = await fetchSession(session.id);
        }
        if (current.status === "running") {
          setStatus("connecting");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [modId]);

  return (
    <View style={styles.container}>
      {status === "launching" && (
        <>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.text}>Launching {modName}...</Text>
        </>
      )}
      {status === "connecting" && (
        <>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.text}>Connecting to stream...</Text>
          <Text style={styles.subtext}>WebRTC placeholder</Text>
        </>
      )}
      {status === "streaming" && (
        <View style={styles.streamPlaceholder}>
          <Text style={styles.streamText}>Stream Active</Text>
        </View>
      )}
      {status === "error" && (
        <>
          <Text style={styles.errorText}>Failed to start session</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </>
      )}
      {sessionId && (
        <TouchableOpacity
          style={styles.terminateButton}
          onPress={() => {
            fetch(`http://localhost:3001/sessions/${sessionId}`, {
              method: "DELETE",
            });
            navigation.goBack();
          }}
        >
          <Text style={styles.terminateText}>End Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    gap: 16,
  },
  text: {
    color: "#e0e0e0",
    fontSize: 18,
    marginTop: 16,
  },
  subtext: {
    color: "#555",
    fontSize: 14,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  streamPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  streamText: {
    color: "#22c55e",
    fontSize: 24,
    fontWeight: "bold",
  },
  terminateButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#ef4444",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  terminateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
