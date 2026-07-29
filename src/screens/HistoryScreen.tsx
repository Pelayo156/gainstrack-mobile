import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ActiveSessionFAB from "../components/ui/ActiveSessionFAB";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
        <Text style={styles.subtitle}>TUS SESIONES PASADAS</Text>
      </View>
      <View style={styles.emptyState}>
        <Ionicons name="time-outline" size={48} color="rgba(255,255,255,0.1)" />
        <Text style={styles.emptyText}>Sin historial aún</Text>
      </View>
      <ActiveSessionFAB onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 28,
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 38,
    letterSpacing: 1.5,
  },
  subtitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 15,
    letterSpacing: 1,
  },
});
