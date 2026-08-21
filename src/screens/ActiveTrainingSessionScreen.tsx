import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  findNodeHandle,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Popover from "react-native-popover-view";
import { useFocusEffect } from "@react-navigation/native";
import useActiveTrainingSessionStore from "../store/useActiveTrainingSessionStore";
import useExercisePickerStore from "../store/useExercisePickerStore";
import GlassCard from "../components/ui/GlassCard";
import {
  TrainingSessionExercise,
  TrainingSessionSet,
} from "../types/trainingSession.types";
import { trainingSessionService } from "../services/trainingSessionService";
import axios from "axios";
import { APIGainstrackErrorResponse } from "../types/api.types";

const H_PADDING = 20;

export default function ActiveTrainingSessionScreen({ navigation }: any) {
  const {
    activeTrainingSession,
    startTimestamp,
    setStartTimestamp,
    clearTrainingSession,
  } = useActiveTrainingSessionStore();

  const [trainingSession, setTrainingSession] = useState(activeTrainingSession);
  const [openExerciseMenuId, setOpenExerciseMenuId] = useState<number | null>(
    null,
  );
  const [completedSetIds, setCompletedSetIds] = useState<Set<number>>(
    new Set(),
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { pickedExercise, clearPickedExercise } = useExercisePickerStore();

  const toggleSetCompleted = (setId: number) => {
    setCompletedSetIds((prev) => {
      const next = new Set(prev);
      if (next.has(setId)) next.delete(setId);
      else next.add(setId);
      return next;
    });
  };

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (activeTrainingSession !== null && trainingSession === null) {
      setTrainingSession(activeTrainingSession);
    }
  }, [activeTrainingSession]);

  useFocusEffect(
    useCallback(() => {
      if (pickedExercise !== null) {
        setTrainingSession((prev) => {
          if (prev === null) return prev;
          return {
            ...prev,
            exercises: [
              ...prev.exercises,
              {
                id: -Date.now(),
                orderIndex: prev.exercises.length + 1,
                notes: "",
                exercise: pickedExercise,
                sets: [],
              },
            ],
          };
        });
        clearPickedExercise();
      }
    }, [pickedExercise]),
  );

  useEffect(() => {
    if (startTimestamp === null) {
      setStartTimestamp(Date.now());
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimestamp!) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTimestamp]);

  const handleInputFocus = (event: any) => {
    const inputHandle = findNodeHandle(event.target);
    const scrollHandle = findNodeHandle(scrollViewRef.current);
    if (inputHandle == null || scrollHandle == null) return;
    setTimeout(() => {
      UIManager.measureLayout(
        inputHandle,
        scrollHandle,
        () => {},
        (_left: number, top: number) => {
          scrollViewRef.current?.scrollTo({
            y: Math.max(top - 120, 0),
            animated: true,
          });
        },
      );
    }, 120);
  };

  const handleBackToMenu = () => {
    navigation.navigate("Routines");
  };

  const handleDeleteSession = () => {
    Alert.alert(
      "Eliminar sesión",
      "¿Estás seguro que quieres eliminar la sesión activa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: handleConfirmDeleteSession,
        },
      ],
    );
  };

  const handleConfirmDeleteSession = async () => {
    if (activeTrainingSession === null) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await trainingSessionService.deleteById(activeTrainingSession.id);
      clearTrainingSession();
      navigation.reset({
        index: 0,
        routes: [{ name: "Routines" }],
      });
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

  const handleUpdateSessionNotes = (notes: string) => {
    setTrainingSession((prev) => {
      if (prev === null) return prev;
      return { ...prev, notes };
    });
  };

  const handleDeleteExercise = () => {
    setTrainingSession((prev) => ({
      ...prev!,
      exercises: prev!.exercises
        .filter((exercise) => exercise.id !== openExerciseMenuId)
        .map((exercise, index) => ({ ...exercise, orderIndex: index + 1 })),
    }));
    setOpenExerciseMenuId(null);
  };

  const handleUpdateSetWeight = (
    exerciseId: number,
    setId: number,
    value: string,
  ) => {
    setTrainingSession((prev) => ({
      ...prev!,
      exercises: prev!.exercises.map((exercise) =>
        exercise.id !== exerciseId
          ? exercise
          : {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id !== setId
                  ? set
                  : { ...set, weight: value === "" ? null : parseFloat(value) },
              ),
            },
      ),
    }));
  };

  const handleUpdateSetReps = (
    exerciseId: number,
    setId: number,
    value: string,
  ) => {
    setTrainingSession((prev) => ({
      ...prev!,
      exercises: prev!.exercises.map((exercise) =>
        exercise.id !== exerciseId
          ? exercise
          : {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id !== setId
                  ? set
                  : { ...set, reps: value === "" ? null : parseInt(value, 10) },
              ),
            },
      ),
    }));
  };

  const handleDeleteSet = (exerciseId: number, setId: number) => {
    setTrainingSession((prev) => ({
      ...prev!,
      exercises: prev!.exercises.map((exercise) =>
        exercise.id !== exerciseId
          ? exercise
          : {
              ...exercise,
              sets: exercise.sets
                .filter((set) => set.id !== setId)
                .map((set, index) => ({ ...set, setNumber: index + 1 })),
            },
      ),
    }));
  };

  const handleAddSet = (exerciseId: number) => {
    setTrainingSession((prev) => ({
      ...prev!,
      exercises: prev!.exercises.map((exercise) =>
        exercise.id !== exerciseId
          ? exercise
          : {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: -Date.now(),
                  setNumber: exercise.sets.length + 1,
                  weight: null,
                  reps: null,
                  notes: "",
                },
              ],
            },
      ),
    }));
  };

  const handleFinalizeSession = async () => {
    if (trainingSession === null || activeTrainingSession === null) {
      setErrorMessage("Hubo un problema al momento de finalizar la sesión.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const sessionId = trainingSession.id;

      // Ejercicios eliminados
      const deletedExercises = activeTrainingSession.exercises.filter(
        (original) =>
          !trainingSession.exercises.some(
            (current) => current.id === original.id,
          ),
      );

      // Ejercicios nuevos
      const newExercises = trainingSession.exercises.filter(
        (exercise) => exercise.id < 0,
      );

      // Se eliminan ejercicios de la sesión desde el backend
      await Promise.all(
        deletedExercises.map((exercise) =>
          trainingSessionService.deleteExerciseById(sessionId, exercise.id),
        ),
      );

      // Se agregan ejercicios nuevos a la sesión desde el backend
      const createdExercises = await Promise.all(
        newExercises.map((exercise) =>
          trainingSessionService.saveExercise(sessionId, {
            exerciseId: exercise.exercise.id,
            orderIndex: exercise.orderIndex,
          }),
        ),
      );

      // Se agregan solo los sets marcados como realizados a los ejercicios recien creados
      await Promise.all(
        createdExercises.flatMap((createdExercise, index) =>
          newExercises[index].sets
            .filter((set) => completedSetIds.has(set.id))
            .map((set) =>
              trainingSessionService.saveExerciseSet(
                sessionId,
                createdExercise.id,
                {
                  setNumber: set.setNumber,
                  weight: set.weight,
                  reps: set.reps,
                  notes: set.notes,
                },
              ),
            ),
        ),
      );

      // Se sincronizan los sets de ejercicios existentes dentro de la sesión
      await Promise.all(
        trainingSession.exercises
          .filter((exercise) => exercise.id > 0)
          .flatMap((exercise) => {
            const originalExercise = activeTrainingSession.exercises.find(
              (original) => original.id === exercise.id,
            );

            // Sets a eliminar: borrados manualmente o no marcados como realizados
            const deletedSets =
              originalExercise?.sets.filter((original) => {
                const current = exercise.sets.find(
                  (set) => set.id === original.id,
                );
                return (
                  current === undefined || !completedSetIds.has(original.id)
                );
              }) ?? [];

            // Sets nuevos marcados como realizados
            const newSets = exercise.sets.filter(
              (set) => set.id < 0 && completedSetIds.has(set.id),
            );

            // Sets existentes marcados como realizados y modificados
            const modifiedSets = exercise.sets.filter((set) => {
              if (set.id < 0 || !completedSetIds.has(set.id)) return false;

              const originalSet = originalExercise?.sets.find(
                (original) => original.id === set.id,
              );

              return (
                set.reps !== originalSet?.reps ||
                set.weight !== originalSet?.weight ||
                set.notes !== originalSet?.notes
              );
            });

            return [
              ...deletedSets.map((set) =>
                trainingSessionService.deleteSetById(
                  sessionId,
                  exercise.id,
                  set.id,
                ),
              ),
              ...newSets.map((set) =>
                trainingSessionService.saveExerciseSet(
                  sessionId,
                  exercise.id,
                  {
                    setNumber: set.setNumber,
                    weight: set.weight,
                    reps: set.reps,
                    notes: set.notes,
                  },
                ),
              ),
              ...modifiedSets.map((set) =>
                trainingSessionService.updateExerciseSet(
                  sessionId,
                  exercise.id,
                  set,
                ),
              ),
            ];
          }),
      );

      clearTrainingSession();
      navigation.reset({
        index: 0,
        routes: [{ name: "Routines" }],
      });
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

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (trainingSession === null) return null;

  return (
    <View style={styles.flex}>
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeftGroup}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={handleBackToMenu}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteSessionButton}
            activeOpacity={0.8}
            onPress={handleDeleteSession}
          >
            <Ionicons
              name="trash-outline"
              size={14}
              color="rgba(255,75,75,0.9)"
            />
            <Text style={styles.deleteSessionButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerCompact}>
          <View style={styles.timerDot} />
          <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
        </View>

        <TouchableOpacity
          style={styles.finalizeButton}
          activeOpacity={0.8}
          onPress={handleFinalizeSession}
        >
          <Text style={styles.finalizeButtonText}>Finalizar</Text>
          <Ionicons name="checkmark" size={14} color="#0D0D0D" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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
              <TextInput
                value={trainingSession.notes ?? ""}
                placeholder="Sin notas"
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={styles.notesInput}
                multiline
                onFocus={handleInputFocus}
                onChangeText={handleUpdateSessionNotes}
              />
            </GlassCard>

            {/* Exercises */}
            {trainingSession.exercises.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Sin ejercicios aún. Agrega uno abajo.
                </Text>
              </View>
            )}

            {trainingSession.exercises
              .slice()
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((ex: TrainingSessionExercise) => (
                <GlassCard
                  key={ex.id}
                  intensity="strong"
                  style={styles.exerciseCard}
                >
                  {/* Exercise header */}
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
                    <Popover
                      isVisible={openExerciseMenuId === ex.id}
                      onRequestClose={() => setOpenExerciseMenuId(null)}
                      from={(sourceRef) => (
                        <TouchableOpacity
                          ref={sourceRef as any}
                          onPress={() => setOpenExerciseMenuId(ex.id)}
                          style={styles.exerciseOptionsButton}
                          activeOpacity={0.6}
                        >
                          <Ionicons
                            name="ellipsis-vertical"
                            size={18}
                            color="rgba(255,255,255,0.45)"
                          />
                        </TouchableOpacity>
                      )}
                      popoverStyle={styles.popover}
                      backgroundStyle={{ backgroundColor: "transparent" }}
                    >
                      <View style={styles.popoverMenu}>
                        <TouchableOpacity
                          style={styles.popoverItem}
                          activeOpacity={0.7}
                          onPress={() => handleDeleteExercise()}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color="rgba(255,75,75,0.9)"
                          />
                          <Text style={styles.popoverItemDanger}>Eliminar</Text>
                        </TouchableOpacity>
                      </View>
                    </Popover>
                  </View>

                  {/* Exercise notes */}
                  <View style={styles.exerciseNotesRow}>
                    <Ionicons
                      name="create-outline"
                      size={13}
                      color="rgba(255,255,255,0.3)"
                      style={styles.exerciseNotesIcon}
                    />
                    <TextInput
                      defaultValue={ex.notes ?? ""}
                      placeholder="Notas del ejercicio"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      style={styles.exerciseNotesInput}
                      onFocus={handleInputFocus}
                    />
                  </View>

                  <View style={styles.setsDivider} />

                  {/* Sets */}
                  <View style={styles.setsContainer}>
                    {ex.sets
                      .slice()
                      .sort((a, b) => a.setNumber - b.setNumber)
                      .map((set: TrainingSessionSet) => (
                        <GlassCard
                          key={set.id}
                          intensity="subtle"
                          style={styles.setCard}
                        >
                          <View style={styles.setHeaderRow}>
                            <View style={styles.setHeaderInfo}>
                              <View style={styles.setBadge}>
                                <Text style={styles.setBadgeText}>
                                  {set.setNumber}
                                </Text>
                              </View>
                              <Text style={styles.setLabel}>
                                SERIE {set.setNumber}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={styles.deleteSetButton}
                              activeOpacity={0.7}
                              onPress={() => handleDeleteSet(ex.id, set.id)}
                            >
                              <Ionicons
                                name="trash-outline"
                                size={15}
                                color="rgba(255,75,75,0.9)"
                              />
                            </TouchableOpacity>
                          </View>

                          <View style={styles.setInputsRow}>
                            <View style={styles.setInputGroup}>
                              <Text style={styles.setInputLabel}>
                                PESO (KG)
                              </Text>
                              <TextInput
                                value={set.weight?.toString() ?? ""}
                                keyboardType="decimal-pad"
                                placeholder="—"
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                style={[
                                  styles.setInput,
                                  completedSetIds.has(set.id) &&
                                    styles.setInputCompleted,
                                ]}
                                onFocus={handleInputFocus}
                                onChangeText={(v) =>
                                  handleUpdateSetWeight(ex.id, set.id, v)
                                }
                              />
                            </View>
                            <View style={styles.setInputDivider} />
                            <View style={styles.setInputGroup}>
                              <Text style={styles.setInputLabel}>
                                REPETICIONES
                              </Text>
                              <TextInput
                                value={set.reps?.toString() ?? ""}
                                keyboardType="number-pad"
                                placeholder="—"
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                style={[
                                  styles.setInput,
                                  completedSetIds.has(set.id) &&
                                    styles.setInputCompleted,
                                ]}
                                onFocus={handleInputFocus}
                                onChangeText={(v) =>
                                  handleUpdateSetReps(ex.id, set.id, v)
                                }
                              />
                            </View>
                            <View style={styles.setInputDivider} />
                            <TouchableOpacity
                              style={[
                                styles.checkButton,
                                completedSetIds.has(set.id) &&
                                  styles.checkButtonCompleted,
                              ]}
                              activeOpacity={0.7}
                              onPress={() => toggleSetCompleted(set.id)}
                            >
                              <Ionicons
                                name="checkmark"
                                size={15}
                                color={
                                  completedSetIds.has(set.id)
                                    ? "#0D0D0D"
                                    : "rgba(255,255,255,0.2)"
                                }
                              />
                            </TouchableOpacity>
                          </View>

                          <View style={styles.setNotesRow}>
                            <Ionicons
                              name="document-text-outline"
                              size={12}
                              color="rgba(255,255,255,0.3)"
                            />
                            <TextInput
                              defaultValue={set.notes ?? ""}
                              placeholder="Notas de la serie"
                              placeholderTextColor="rgba(255,255,255,0.3)"
                              style={styles.setNotesInput}
                              onFocus={handleInputFocus}
                            />
                          </View>
                        </GlassCard>
                      ))}
                  </View>

                  <TouchableOpacity
                    style={styles.addSetButton}
                    activeOpacity={0.8}
                    onPress={() => handleAddSet(ex.id)}
                  >
                    <Ionicons name="add" size={16} color="#AAFF00" />
                    <Text style={styles.addSetButtonText}>Agregar serie</Text>
                  </TouchableOpacity>
                </GlassCard>
              ))}

            <TouchableOpacity
              style={styles.addExerciseButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("ExercisePicker")}
            >
              <Ionicons name="add" size={20} color="#AAFF00" />
              <Text style={styles.addExerciseButtonText}>
                Agregar ejercicio
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    justifyContent: "space-between",
    paddingHorizontal: H_PADDING,
    paddingTop: 14,
    paddingBottom: 14,
  },
  headerLeftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
  },
  timerCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  timerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#AAFF00",
  },
  timerText: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 18,
    letterSpacing: 1.5,
  },
  finalizeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#AAFF00",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  finalizeButtonText: {
    color: "#0D0D0D",
    fontFamily: "Inter-Bold",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 40,
    gap: 16,
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
  notesInput: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 19,
    minHeight: 40,
    textAlignVertical: "top",
  },
  emptyContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 14,
    letterSpacing: 0.5,
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
  exerciseOptionsButton: {
    padding: 4,
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
    borderRadius: 16,
    padding: 12,
  },
  setHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  setHeaderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  deleteSetButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "rgba(255,75,75,0.08)",
    alignItems: "center",
    justifyContent: "center",
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
    color: "rgba(255,255,255,0.3)",
    fontFamily: "Inter-Bold",
    fontSize: 17,
    paddingVertical: 4,
  },
  setInputCompleted: {
    color: "#FFFFFF",
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
  popover: {
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
    padding: 0,
  },
  popoverMenu: {
    minWidth: 170,
  },
  popoverItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  popoverItemDanger: {
    color: "rgba(255,75,75,0.9)",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  addSetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(170,255,0,0.06)",
    borderColor: "rgba(170,255,0,0.25)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  addSetButtonText: {
    color: "#AAFF00",
    fontFamily: "Inter-Bold",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(170,255,0,0.08)",
    borderColor: "rgba(170,255,0,0.3)",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
  },
  addExerciseButtonText: {
    color: "#AAFF00",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  deleteSessionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,75,75,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,75,75,0.22)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteSessionButtonText: {
    color: "rgba(255,75,75,0.9)",
    fontFamily: "Inter-Bold",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  checkButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkButtonCompleted: {
    backgroundColor: "#AAFF00",
    borderColor: "#AAFF00",
  },
});
