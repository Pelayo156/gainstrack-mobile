import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { routineService } from "../services/routineService";
import { APIGainsTrackRoutineDetailResponse } from "../types/routine.types";
import axios from "axios";
import { APIGainstrackErrorResponse } from "../types/api.types";
import Toast from "react-native-toast-message";

const H_PADDING = 20;

export default function EditRoutineScreen({ route, navigation }: any) {
  const { routineId } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [originalRoutine, setOriginalRoutine] =
    useState<APIGainsTrackRoutineDetailResponse | null>(null);
  const [routine, setRoutine] =
    useState<APIGainsTrackRoutineDetailResponse | null>(null);

  useEffect(() => {
    console.log("INICIO VISTA EDITAR RUTINA");

    const fetchRoutineById = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await routineService.findById(routineId);
        setOriginalRoutine(response);
        setRoutine(response);
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

    fetchRoutineById();
  }, []);

  const handleSaveRoutine = async () => {
    console.log("INICIO EVENTO GUARDAR CAMBIOS RUTINA");

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (routine != null) {
        // comienzo de actualización de rutina
        for (const exercise of routine.exercises) {
          for (const set of exercise.sets) {
            // Busco el set correspondiente en la rutina orignal para comparar si es que hubieron cambios
            const originalExercise = originalRoutine?.exercises.find(
              (originalExercise) => originalExercise.id === exercise.id,
            );

            const originalSet = originalExercise?.sets.find(
              (originalSet) => originalSet.id === set.id,
            );

            if (
              set.reps !== originalSet?.reps ||
              set.weight !== originalSet?.weight
            ) {
              await routineService.updateExerciseSet(
                routine.id,
                exercise.id,
                set,
              );
            }
          }
        }
        setOriginalRoutine(routine);

        Toast.show({
          type: "success",
          text1: "Rutina actualizada",
        });
      }
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

  const handleUpdateSetWeight = (
    exerciseId: number,
    setId: number,
    newWeight: string,
  ) => {
    if (routine === null) return;

    setRoutine({
      ...routine,
      exercises: routine.exercises.map((exercise) =>
        exercise.id !== exerciseId
          ? exercise
          : {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id !== setId
                  ? set
                  : {
                      ...set,
                      weight: parseFloat(newWeight) || 0,
                    },
              ),
            },
      ),
    });
  };

  const handleUpdateSetReps = (
    exerciseId: number,
    setId: number,
    newReps: string,
  ) => {
    if (routine === null) return;

    setRoutine({
      ...routine,
      exercises: routine.exercises.map((exercise) =>
        exercise.id !== exerciseId
          ? exercise
          : {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id !== setId
                  ? set
                  : {
                      ...set,
                      reps: parseFloat(newReps) || 0,
                    },
              ),
            },
      ),
    });
  };

  return (
    <LinearGradient colors={["#080808", "#0f0f14"]} style={styles.flex}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle} numberOfLines={1}>
          Editar rutina
        </Text>
        <TouchableOpacity
          onPress={handleSaveRoutine}
          style={styles.headerIconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={24} color="#E3B341" />
        </TouchableOpacity>
      </View>

      {isLoading && (
        <ActivityIndicator
          color="#E3B341"
          size="large"
          style={styles.loadingIndicator}
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

      {!isLoading && errorMessage === null && routine && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.titleSection}>
              <Text style={styles.routineTitle}>{routine.name}</Text>
            </View>

            <View style={styles.notesCard}>
              <View style={styles.notesCardHeader}>
                <Ionicons
                  name="document-text-outline"
                  size={15}
                  color="rgba(255,255,255,0.4)"
                />
                <Text style={styles.notesCardLabel}>Notas de la rutina</Text>
              </View>
              <TextInput
                value={routine.notes ?? ""}
                placeholder="Sin notas"
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={styles.notesInput}
                multiline
              />
            </View>

            {routine.exercises.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Esta rutina no tiene ejercicios aún
                </Text>
              </View>
            )}

            {routine.exercises.map((routineExercise) => (
              <View key={routineExercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeaderRow}>
                  <View style={styles.exerciseHeaderInfo}>
                    <Text style={styles.exerciseName} numberOfLines={2}>
                      {routineExercise.exercise.name}
                    </Text>
                    <View style={styles.muscleGroupPill}>
                      <Text style={styles.muscleGroupPillText}>
                        {routineExercise.exercise.muscleGroup.name}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.exerciseOrderBadge}>
                    <Text style={styles.exerciseOrderBadgeText}>
                      {routineExercise.orderIndex}
                    </Text>
                  </View>
                </View>

                <View style={styles.exerciseNotesRow}>
                  <Ionicons
                    name="create-outline"
                    size={13}
                    color="rgba(255,255,255,0.3)"
                    style={styles.exerciseNotesIcon}
                  />
                  <TextInput
                    value={routineExercise.notes}
                    placeholder="Notas del ejercicio"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.exerciseNotesInput}
                  />
                </View>

                <View style={styles.setsDivider} />

                <View style={styles.setsContainer}>
                  {routineExercise.sets.map((routineExerciseSet) => (
                    <View key={routineExerciseSet.id} style={styles.setCard}>
                      <View style={styles.setHeaderRow}>
                        <View style={styles.setBadge}>
                          <Text style={styles.setBadgeText}>
                            {routineExerciseSet.setNumber}
                          </Text>
                        </View>
                        <Text style={styles.setLabel}>
                          SERIE {routineExerciseSet.setNumber}
                        </Text>
                      </View>

                      <View style={styles.setInputsRow}>
                        <View style={styles.setInputGroup}>
                          <Text style={styles.setInputLabel}>PESO (KG)</Text>
                          <TextInput
                            value={routineExerciseSet.weight.toString()}
                            onChangeText={(newWeight) =>
                              handleUpdateSetWeight(
                                routineExercise.id,
                                routineExerciseSet.id,
                                newWeight,
                              )
                            }
                            keyboardType="decimal-pad"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            style={styles.setInput}
                          />
                        </View>
                        <View style={styles.setInputDivider} />
                        <View style={styles.setInputGroup}>
                          <Text style={styles.setInputLabel}>REPETICIONES</Text>
                          <TextInput
                            value={routineExerciseSet.reps.toString()}
                            onChangeText={(newReps) =>
                              handleUpdateSetReps(
                                routineExercise.id,
                                routineExerciseSet.id,
                                newReps,
                              )
                            }
                            keyboardType="number-pad"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            style={styles.setInput}
                          />
                        </View>
                      </View>

                      <View style={styles.setNotesRow}>
                        <Ionicons
                          name="document-text-outline"
                          size={12}
                          color="rgba(255,255,255,0.3)"
                        />
                        <TextInput
                          value={routineExerciseSet.notes ?? ""}
                          placeholder="Notas de la serie"
                          placeholderTextColor="rgba(255,255,255,0.3)"
                          style={styles.setNotesInput}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </TouchableWithoutFeedback>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: H_PADDING,
    paddingBottom: 16,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBarTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 16,
    letterSpacing: 0.3,
    textAlign: "center",
    marginHorizontal: 12,
  },
  loadingIndicator: {
    marginTop: 60,
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
  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 40,
    gap: 16,
  },
  titleSection: {
    marginBottom: 4,
  },
  routineTitle: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 28,
    letterSpacing: 0.3,
  },
  routineSubtitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 6,
  },
  notesCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
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
  notesInput: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 19,
    minHeight: 40,
    textAlignVertical: "top",
  },
  exerciseCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
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
    backgroundColor: "rgba(227,179,65,0.12)",
    borderColor: "rgba(227,179,65,0.3)",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  muscleGroupPillText: {
    color: "#E3B341",
    fontSize: 11,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.5,
  },
  exerciseOrderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseOrderBadgeText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  exerciseNotesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  exerciseNotesIcon: {
    marginTop: 1,
  },
  exerciseNotesInput: {
    flex: 1,
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
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
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderRadius: 14,
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
    borderColor: "rgba(227,179,65,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  setBadgeText: {
    color: "#E3B341",
    fontSize: 11,
    fontFamily: "Inter-Bold",
  },
  setLabel: {
    color: "rgba(255,255,255,0.4)",
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
  setInput: {
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
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  setNotesInput: {
    flex: 1,
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
});
