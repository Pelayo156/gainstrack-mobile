import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../store/useAuthStore";
import ScreenHeader from "../components/ui/ScreenHeader";

const H_PADDING = 20;

export default function ProfileScreen() {
  const { logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Perfil" style={styles.header} />

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={18} color="rgba(255,75,75,0.9)" />
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingHorizontal: H_PADDING,
    paddingTop: 20,
    marginBottom: 28,
  },
  content: {
    paddingHorizontal: H_PADDING,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255,75,75,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,75,75,0.22)",
    borderRadius: 14,
    paddingVertical: 16,
  },
  logoutButtonText: {
    color: "rgba(255,75,75,0.9)",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
