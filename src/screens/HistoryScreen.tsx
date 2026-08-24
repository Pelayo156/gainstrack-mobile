import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
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
import { routineService } from "../services/routineService";
import { gymService } from "../services/gymService";
import { trainingSessionService } from "../services/trainingSessionService";
import { APIGainstrackRoutineSummaryResponse } from "../types/routine.types";
import { APIGainsTrackGymResponse } from "../types/gym.types";
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
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [filtersErrorMessage, setFiltersErrorMessage] = useState<
    string | null
  >(null);
  const [routines, setRoutines] = useState<
    APIGainstrackRoutineSummaryResponse[]
  >([]);
  const [gyms, setGyms] = useState<APIGainsTrackGymResponse[]>([]);
  const [selectedRoutine, setSelectedRoutine] =
    useState<APIGainstrackRoutineSummaryResponse | null>(null);
  const [selectedGym, setSelectedGym] =
    useState<APIGainsTrackGymResponse | null>(null);

  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionsErrorMessage, setSessionsErrorMessage] = useState<
    string | null
  >(null);
  const [sessions, setSessions] = useState<
    APIGainstrackTrainingSessionSummaryResponse[]
  >([]);

  /** Carga las rutinas y gimnasios del usuario cada vez que la pantalla toma foco */
  useFocusEffect(
    useCallback(() => {
      fetchFilters();
    }, []),
  );

  const fetchFilters = async () => {
    setIsLoadingFilters(true);
    setFiltersErrorMessage(null);
    try {
      const [routinesResponse, gymsResponse] = await Promise.all([
        routineService.findAll(),
        gymService.findAll(),
      ]);
      setRoutines(routinesResponse);
      setGyms(gymsResponse);
      setSelectedRoutine(routinesResponse[0] ?? null);
      setSelectedGym(gymsResponse[0] ?? null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIGainstrackErrorResponse;
        setFiltersErrorMessage(apiError.message);
      } else {
        setFiltersErrorMessage("Error inesperado, intente nuevamente");
      }
    } finally {
      setIsLoadingFilters(false);
    }
  };

  /** Carga las sesiones de entrenamiento filtradas por la rutina y gimnasio seleccionados */
  useEffect(() => {
    if (selectedRoutine === null || selectedGym === null) {
      setSessions([]);
      return;
    }

    const fetchSessions = async () => {
      setIsLoadingSessions(true);
      setSessionsErrorMessage(null);
      try {
        const response =
          await trainingSessionService.findfindAllByRoutineAndGym(
            selectedRoutine.id,
            selectedGym.id,
          );
        setSessions(response);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const apiError = error.response?.data as APIGainstrackErrorResponse;
          setSessionsErrorMessage(apiError.message);
        } else {
          setSessionsErrorMessage("Error inesperado, intente nuevamente");
        }
      } finally {
        setIsLoadingSessions(false);
      }
    };
    fetchSessions();
  }, [selectedRoutine, selectedGym]);

  const hasFilters = routines.length > 0 && gyms.length > 0;
  const isLoading = isLoadingFilters || isLoadingSessions;
  const errorMessage = filtersErrorMessage ?? sessionsErrorMessage;

  return (
    <View style={styles.container}>
      <FlatList
        data={
          !isLoading && errorMessage === null && hasFilters ? sessions : []
        }
        keyExtractor={(session) => session.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Historial</Text>
              <Text style={styles.subtitle}>TUS SESIONES PASADAS</Text>
            </View>

            {isLoadingFilters && (
              <ActivityIndicator
                color="#AAFF00"
                size="large"
                style={{ marginTop: 40 }}
              />
            )}

            {!isLoadingFilters && filtersErrorMessage !== null && (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="rgba(255,90,90,0.9)"
                />
                <Text style={styles.errorText}>{filtersErrorMessage}</Text>
              </View>
            )}

            {!isLoadingFilters &&
              filtersErrorMessage === null &&
              !hasFilters && (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="time-outline"
                    size={48}
                    color="rgba(255,255,255,0.1)"
                  />
                  <Text style={styles.emptyText}>
                    Necesitas al menos una rutina y un gimnasio guardados
                    para ver el historial
                  </Text>
                </View>
              )}

            {!isLoadingFilters && filtersErrorMessage === null && hasFilters && (
              <>
                <Text style={styles.filterLabel}>RUTINA</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipRow}
                  style={styles.chipScroll}
                >
                  {routines.map((routine) => {
                    const isSelected = selectedRoutine?.id === routine.id;
                    return (
                      <TouchableOpacity
                        key={routine.id}
                        activeOpacity={0.8}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => setSelectedRoutine(routine)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {routine.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <Text style={styles.filterLabel}>GIMNASIO</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipRow}
                  style={styles.chipScroll}
                >
                  {gyms.map((gym) => {
                    const isSelected = selectedGym?.id === gym.id;
                    return (
                      <TouchableOpacity
                        key={gym.id}
                        activeOpacity={0.8}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => setSelectedGym(gym)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {gym.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </>
            )}

            {!isLoadingFilters &&
              filtersErrorMessage === null &&
              hasFilters &&
              isLoadingSessions && (
                <ActivityIndicator
                  color="#AAFF00"
                  size="large"
                  style={{ marginTop: 24 }}
                />
              )}

            {!isLoadingFilters &&
              filtersErrorMessage === null &&
              hasFilters &&
              !isLoadingSessions &&
              sessionsErrorMessage !== null && (
                <View style={styles.errorBanner}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color="rgba(255,90,90,0.9)"
                  />
                  <Text style={styles.errorText}>{sessionsErrorMessage}</Text>
                </View>
              )}

            {!isLoadingFilters &&
              filtersErrorMessage === null &&
              hasFilters &&
              !isLoadingSessions &&
              sessionsErrorMessage === null &&
              sessions.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="time-outline"
                    size={48}
                    color="rgba(255,255,255,0.1)"
                  />
                  <Text style={styles.emptyText}>
                    Sin sesiones para esta rutina en este gimnasio
                  </Text>
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
              <Text style={styles.sessionDate}>
                {formatDate(session.sessionDate)}
              </Text>
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
  filterLabel: {
    color: "rgba(255,255,255,0.3)",
    fontFamily: "Inter-Bold",
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  chipScroll: {
    marginBottom: 20,
  },
  chipRow: {
    gap: 10,
    paddingRight: H_PADDING,
  },
  chip: {
    backgroundColor: "#1E1E1E",
    borderColor: "#2A2A2A",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: 200,
  },
  chipSelected: {
    backgroundColor: "#AAFF00",
    borderColor: "#AAFF00",
  },
  chipText: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter-Bold",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  chipTextSelected: {
    color: "#0D0D0D",
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
    textAlign: "center",
  },
  card: {
    borderRadius: 24,
    padding: 18,
  },
  sessionDate: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  sessionNotes: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
    lineHeight: 18,
  },
});
