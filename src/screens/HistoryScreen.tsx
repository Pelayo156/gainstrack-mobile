import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import ActiveSessionFAB from "../components/ui/ActiveSessionFAB";
import GlassCard from "../components/ui/GlassCard";
import { trainingSessionService } from "../services/trainingSessionService";
import { APIGainstrackTrainingSessionSummaryResponse } from "../types/trainingSession.types";
import { APIGainstrackErrorResponse } from "../types/api.types";

const H_PADDING = 20;
const CARD_GAP = 16;

/** Formatea una fecha al estilo "dd mon. yyyy" en español */
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function HistoryScreen({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessions, setSessions] = useState<
    APIGainstrackTrainingSessionSummaryResponse[]
  >([]);

  /** Carga el historial de sesiones de entrenamiento del usuario cada vez que la pantalla toma foco */
  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, []),
  );

  const fetchSessions = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await trainingSessionService.findAll();
      setSessions(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIGainstrackErrorResponse;
        setErrorMessage(apiError.message);
      } else {
        setErrorMessage("Error inesperado, intente nuevamente");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={!isLoading && errorMessage === null ? sessions : []}
        keyExtractor={(session) => session.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Historial</Text>
              <Text style={styles.subtitle}>TUS SESIONES PASADAS</Text>
            </View>

            {isLoading && (
              <ActivityIndicator
                color="#AAFF00"
                size="large"
                style={{ marginTop: 40 }}
              />
            )}

            {!isLoading && errorMessage !== null && (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="rgba(255,90,90,0.9)"
                />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {!isLoading && errorMessage === null && sessions.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons
                  name="time-outline"
                  size={48}
                  color="rgba(255,255,255,0.1)"
                />
                <Text style={styles.emptyText}>Sin historial aún</Text>
              </View>
            )}
          </>
        }
        renderItem={({ item: session }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("TrainingSessionDetail", {
                id: session.id,
              })
            }
          >
            <GlassCard intensity="strong" style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.gymRow}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color="rgba(255,255,255,0.4)"
                  />
                  <Text style={styles.gymName} numberOfLines={1}>
                    {session.gym ? session.gym.name : "Sin gimnasio"}
                  </Text>
                </View>
                <Text style={styles.sessionDate}>
                  {formatDate(session.sessionDate)}
                </Text>
              </View>
              <Text style={styles.sessionNotes} numberOfLines={3}>
                {session.notes ?? "Sin notas"}
              </Text>
            </GlassCard>
          </TouchableOpacity>
        )}
      />
      <ActiveSessionFAB
        onPress={() => {
          navigation.navigate("Rutinas", { screen: "ActiveTrainingSession" });
        }}
      />
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
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 20,
    gap: CARD_GAP,
    paddingBottom: 32,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,60,60,0.08)",
    borderColor: "rgba(255,60,60,0.2)",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorText: {
    flex: 1,
    color: "rgba(255,90,90,0.95)",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    gap: 16,
    marginTop: 60,
  },
  emptyText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 15,
    letterSpacing: 1,
  },
  card: {
    borderRadius: 24,
    padding: 18,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gymRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginRight: 10,
  },
  gymName: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  sessionDate: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    letterSpacing: 0.3,
  },
  sessionNotes: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
    lineHeight: 18,
  },
});
