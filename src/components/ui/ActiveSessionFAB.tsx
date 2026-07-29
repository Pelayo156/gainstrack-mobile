import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useActiveTrainingSessionStore from "../../store/useActiveTrainingSessionStore";

type ActiveSessionFABProps = {
  onPress?: () => void;
};

const H_PADDING = 20;

export default function ActiveSessionFAB({ onPress }: ActiveSessionFABProps) {
  const { activeTrainingSession, startTimestamp, clearTrainingSession } =
    useActiveTrainingSessionStore();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (startTimestamp === null) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimestamp) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTimestamp]);

  if (activeTrainingSession === null || startTimestamp === null) return null;

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar sesión",
      "¿Estás seguro que quieres eliminar la sesión activa?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: clearTrainingSession },
      ],
    );
  };

  return (
    <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.statusRow}>
          <View style={styles.dot} />
          <Text style={styles.statusLabel}>EN PROGRESO</Text>
        </View>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={18} color="rgba(255,75,75,0.9)" />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.sessionName} numberOfLines={1}>
          {activeTrainingSession.notes
            ? activeTrainingSession.notes
            : "Sesión activa"}
        </Text>
        <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    left: H_PADDING,
    right: H_PADDING,
    backgroundColor: "#1E1E1E",
    borderWidth: 1.5,
    borderColor: "#AAFF00",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
    shadowColor: "#AAFF00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#AAFF00",
  },
  statusLabel: {
    color: "#AAFF00",
    fontFamily: "Inter-Bold",
    fontSize: 10,
    letterSpacing: 2,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,75,75,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionName: {
    flex: 1,
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    marginRight: 10,
  },
  timer: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 1,
  },
});
