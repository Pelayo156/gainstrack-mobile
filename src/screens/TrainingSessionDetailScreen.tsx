import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import GlassCard from "../components/ui/GlassCard";
import { trainingSessionService } from "../services/trainingSessionService";
import { APIGainstrackTrainingSessionDetailResponse } from "../types/trainingSession.types";
import { APIGainstrackErrorResponse } from "../types/api.types";

const H_PADDING = 20;

/** Formatea una fecha al estilo "dd mon. yyyy" en español */
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TrainingSessionDetailScreen({
  route,
  navigation,
}: any) {
  const { id } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [session, setSession] =
    useState<APIGainstrackTrainingSessionDetailResponse | null>(null);

  /** Carga el detalle de la sesión de entrenamiento seleccionada */
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await trainingSessionService.findById(id);
        setSession(response);
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
    fetchSession();
  }, [id]);

  return (
    <View style={styles.flex}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Historial</Text>
        </TouchableOpacity>
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

      {!isLoading && errorMessage === null && session !== null && (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Session info */}
          <GlassCard intensity="strong" style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color="rgba(255,255,255,0.4)"
              />
              <Text style={styles.infoText} numberOfLines={1}>
                {session.gym ? session.gym.name : "Sin gimnasio"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color="rgba(255,255,255,0.4)"
              />
              <Text style={styles.infoText}>
                {formatDate(session.sessionDate)}
              </Text>
            </View>
          </GlassCard>

          {/* Session notes */}
          <GlassCard style={styles.notesCard}>
            <View style={styles.notesCardHeader}>
              <Ionicons
                name="document-text-outline"
                size={15}
                color="rgba(255,255,255,0.4)"
              />
              <Text style={styles.notesCardLabel}>Notas de la sesión</Text>
            </View>
            <Text style={styles.notesText}>
              {session.notes ?? "Sin notas"}
            </Text>
          </GlassCard>

          {/* Exercises */}
          {session.exercises.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Sin ejercicios registrados en esta sesión.
              </Text>
            </View>
          )}

          {session.exercises
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((ex) => (
              <GlassCard key={ex.id} intensity="strong" style={styles.exerciseCard}>
                <View style={styles.exerciseHeaderRow}>
                  <View style={styles.exerciseHeaderInfo}>
                    <Text style={styles.exerciseName} numberOfLines={2}>
                      {ex.exercise.name}
                    </Text>
                    <View style={styles.muscleGroupPill}>
                      <Text style={styles.muscleGroupPillText}>
                        {ex.exercise.muscleGroup.name}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.exerciseOrderBadge}>
                    <Text style={styles.exerciseOrderBadgeText}>
                      {ex.orderIndex}
                    </Text>
                  </View>
                </View>

                {ex.notes !== null && ex.notes !== "" && (
                  <View style={styles.exerciseNotesRow}>
                    <Ionicons
                      name="create-outline"
                      size={13}
                      color="rgba(255,255,255,0.3)"
                      style={styles.exerciseNotesIcon}
                    />
                    <Text style={styles.exerciseNotesText}>{ex.notes}</Text>
                  </View>
                )}

                <View style={styles.setsDivider} />

                <View style={styles.setsContainer}>
                  {ex.sets
                    .slice()
                    .sort((a, b) => a.setNumber - b.setNumber)
                    .map((set) => (
                      <GlassCard
                        key={set.id}
                        intensity="subtle"
                        style={styles.setCard}
                      >
                        <View style={styles.setHeaderRow}>
                          <View style={styles.setBadge}>
                            <Text style={styles.setBadgeText}>
                              {set.setNumber}
                            </Text>
                          </View>
                          <Text style={styles.setLabel}>
                            SERIE {set.setNumber}
                          </Text>
                        </View>

                        <View style={styles.setInputsRow}>
                          <View style={styles.setInputGroup}>
                            <Text style={styles.setInputLabel}>
                              PESO (KG)
                            </Text>
                            <Text style={styles.setInputValue}>
                              {set.weight ?? "—"}
                            </Text>
                          </View>
                          <View style={styles.setInputDivider} />
                          <View style={styles.setInputGroup}>
                            <Text style={styles.setInputLabel}>
                              REPETICIONES
                            </Text>
                            <Text style={styles.setInputValue}>
                              {set.reps ?? "—"}
                            </Text>
                          </View>
                        </View>

                        {set.notes !== null && set.notes !== "" && (
                          <View style={styles.setNotesRow}>
                            <Ionicons
                              name="document-text-outline"
                              size={12}
                              color="rgba(255,255,255,0.3)"
                            />
                            <Text style={styles.setNotesText}>
                              {set.notes}
                            </Text>
                          </View>
                        )}
                      </GlassCard>
                    ))}
                </View>
              </GlassCard>
            ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: H_PADDING,
    paddingTop: 14,
    paddingBottom: 14,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,60,60,0.08)",
    borderColor: "rgba(255,60,60,0.2)",
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: H_PADDING,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorText: {
    flex: 1,
    color: "rgba(255,90,90,0.95)",
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 40,
    gap: 16,
  },
  infoCard: {
    borderRadius: 18,
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  notesCard: {
    borderRadius: 18,
  },
  notesCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  notesCardLabel: {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "Inter-Bold",
    fontSize: 11,
    letterSpacing: 1,
  },
  notesText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 19,
  },
  emptyContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 14,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  exerciseCard: {
    borderRadius: 22,
  },
  exerciseHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  exerciseHeaderInfo: {
    flex: 1,
    gap: 8,
  },
  exerciseName: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  muscleGroupPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(170,255,0,0.12)",
    borderColor: "rgba(170,255,0,0.3)",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  muscleGroupPillText: {
    color: "#AAFF00",
    fontSize: 11,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.5,
  },
  exerciseOrderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(170,255,0,0.1)",
    borderColor: "rgba(170,255,0,0.25)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseOrderBadgeText: {
    color: "rgba(253,230,138,0.9)",
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  exerciseNotesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 12,
  },
  exerciseNotesIcon: {
    marginTop: 1,
  },
  exerciseNotesText: {
    flex: 1,
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    lineHeight: 18,
  },
  setsDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 14,
  },
  setsContainer: {
    gap: 10,
  },
  setCard: {
    borderRadius: 16,
    padding: 12,
  },
  setHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  setBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(170,255,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  setBadgeText: {
    color: "#AAFF00",
    fontSize: 11,
    fontFamily: "Inter-Bold",
  },
  setLabel: {
    color: "rgba(253,230,138,0.65)",
    fontSize: 11,
    letterSpacing: 1.5,
    fontFamily: "Inter-Bold",
  },
  setInputsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  setInputGroup: {
    flex: 1,
    gap: 4,
  },
  setInputLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    letterSpacing: 1,
  },
  setInputValue: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 17,
    paddingVertical: 4,
  },
  setInputDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 16,
    alignSelf: "stretch",
  },
  setNotesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  setNotesText: {
    flex: 1,
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    lineHeight: 16,
  },
});
