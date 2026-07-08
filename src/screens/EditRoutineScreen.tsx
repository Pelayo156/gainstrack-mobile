import { useCallback, useEffect, useState } from "react";
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
import Popover from "react-native-popover-view";
import { useFocusEffect } from "@react-navigation/native";
import useExercisePickerStore from "../store/useExercisePickerStore";

const H_PADDING = 20;

export default function EditRoutineScreen({ route, navigation }: any) {
  const { routineId } = route.params;
  const { pickedExercise, clearPickedExercise } = useExercisePickerStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [originalRoutine, setOriginalRoutine] =
    useState<APIGainsTrackRoutineDetailResponse | null>(null);
  const [routine, setRoutine] =
    useState<APIGainsTrackRoutineDetailResponse | null>(null);
  const [openExerciseMenuId, setOpenExerciseMenuId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    console.log("INICIO DE VISTA EDITAR RUTINA");
    fetchRoutineById();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (pickedExercise !== null) {
        console.log("CARGANDO EJERCICIO SELECCIONADO DE FORMA LOCAL");
        setRoutine((prev) => ({
          ...prev!,
          exercises: [
            ...prev!.exercises,
            {
              id: -Date.now(),
              orderIndex: prev!.exercises.length + 1,
              notes: "",
              exercise: pickedExercise,
              sets: [],
            },
          ],
        }));
        clearPickedExercise();
      }
    }, [pickedExercise]),
  );

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

  const handleDeleteRoutineExercise = async () => {
    console.log(
      `INICIO EVENTO ELIMINAR EJERCICIO DE RUTINA CON ID: ${openExerciseMenuId} DE FORMA LOCAL`,
    );

    setIsLoading(true);

    setRoutine((prev) => ({
      ...prev!,
      exercises: prev!.exercises
        .filter((exercise) => exercise.id !== openExerciseMenuId)
        .map((exercise, index) => ({
          ...exercise,
          orderIndex: index + 1,
        })),
    }));
    setIsLoading(false);
  };

  const handleDeleteSet = (routineExerciseId: number, setId: number) => {
    console.log("INICIO EVENTO ELIMINAR SET DE EJERCICIO");

    setIsLoading(true);
    setRoutine((prev) => ({
      ...prev!,
      exercises: prev!.exercises.map((exercise) =>
        exercise.id != routineExerciseId
          ? exercise
          : {
              ...exercise,
              sets: exercise.sets
                .filter((set) => set.id !== setId)
                .map((set, index) => ({ ...set, setNumber: index + 1 })),
            },
      ),
    }));
    setIsLoading(false);
  };

  const handleAddSet = async (routineExerciseId: number) => {
    console.log("INICIO EVENTO AÑADIR SET A EJERCICIO");

    setIsLoading(true);

    setRoutine((prev) => ({
      ...prev!,
      exercises: prev!.exercises.map((exercise) =>
        exercise.id !== routineExerciseId
          ? exercise
          : {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: -Date.now(),
                  setNumber: exercise.sets.length + 1,
                  weight: 0,
                  reps: 0,
                  notes: "",
                },
              ],
            },
      ),
    }));
    setIsLoading(false);
  };

  const handleSaveRoutine = async () => {
    console.log("INICIO EVENTO GUARDAR CAMBIOS RUTINA");

    setIsLoading(true);
    setErrorMessage(null);

    if (routine == null || originalRoutine == null) {
      setErrorMessage("Hubo un problema al momento de actualizar la rutina.");
      return;
    }

    // Ejercicios eliminados
    const deletedExercises = originalRoutine!.exercises.filter(
      (original) =>
        !routine?.exercises.some((current) => current.id === original.id),
    );

    // Ejercicios nuevos
    const newExercises = routine?.exercises.filter(
      (exercise) => exercise.id < 0,
    );

    // Se eliminan ejercicios de la rutina desde el backend
    await Promise.all(
      deletedExercises.map((exercise) =>
        routineService.deleteExerciseById(routineId, exercise.id),
      ),
    );

    // Se agregn ejercicios nuevos a la rutina desde el backend
    await Promise.all(
      newExercises.map((routineExercise) =>
        routineService.saveExercise(routineId, {
          exerciseId: routineExercise.exercise.id,
          orderIndex: routineExercise.orderIndex,
        }),
      ),
    );
  };

  return (
    <LinearGradient colors={["#080808", "#0f0f14"]} style={styles.flex}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerCancelButton}
          activeOpacity={0.7}
        >
          <Text style={styles.headerCancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerBarTitle} numberOfLines={1}>
          Editar rutina
        </Text>
        <TouchableOpacity
          onPress={handleSaveRoutine}
          style={styles.headerIconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={24} color="#F7C536" />
        </TouchableOpacity>
      </View>

      {isLoading && (
        <ActivityIndicator
          color="#F7C536"
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
                  <Popover
                    isVisible={openExerciseMenuId === routineExercise.id}
                    onRequestClose={() => setOpenExerciseMenuId(null)}
                    from={(sourceRef, showPopover) => (
                      <TouchableOpacity
                        ref={sourceRef as any}
                        onPress={() =>
                          setOpenExerciseMenuId(routineExercise.id)
                        }
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
                        onPress={() => handleDeleteRoutineExercise()}
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
                        <View style={styles.setHeaderInfo}>
                          <View style={styles.setBadge}>
                            <Text style={styles.setBadgeText}>
                              {routineExerciseSet.setNumber}
                            </Text>
                          </View>
                          <Text style={styles.setLabel}>
                            SERIE {routineExerciseSet.setNumber}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteSetButton}
                          activeOpacity={0.7}
                          onPress={() =>
                            handleDeleteSet(
                              routineExercise.id,
                              routineExerciseSet.id,
                            )
                          }
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

                <TouchableOpacity
                  style={styles.addSetButton}
                  activeOpacity={0.8}
                  onPress={() => handleAddSet(routineExercise.id)}
                >
                  <Ionicons name="add" size={16} color="#F7C536" />
                  <Text style={styles.addSetButtonText}>Agregar set</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addExerciseButton}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("ExercisePicker", {
                  routineId: routine.id,
                });
              }}
            >
              <Ionicons name="add" size={20} color="#F7C536" />
              <Text style={styles.addExerciseButtonText}>
                Agregar ejercicio
              </Text>
            </TouchableOpacity>
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
  headerCancelButton: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCancelButtonText: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter-Bold",
    fontSize: 14,
    letterSpacing: 0.3,
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
  exerciseOptionsButton: {
    padding: 4,
  },
  exerciseName: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  muscleGroupPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(247,197,54,0.12)",
    borderColor: "rgba(247,197,54,0.3)",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  muscleGroupPillText: {
    color: "#F7C536",
    fontSize: 11,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.5,
  },
  exerciseOrderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(247,197,54,0.1)",
    borderColor: "rgba(247,197,54,0.25)",
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
    justifyContent: "space-between",
    marginBottom: 10,
  },
  setHeaderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteSetButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "rgba(255,75,75,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  setBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(247,197,54,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  setBadgeText: {
    color: "#F7C536",
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
  popover: {
    backgroundColor: "#0a0a10",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
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
    backgroundColor: "rgba(247,197,54,0.06)",
    borderColor: "rgba(247,197,54,0.25)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  addSetButtonText: {
    color: "#F7C536",
    fontFamily: "Inter-Bold",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(247,197,54,0.08)",
    borderColor: "rgba(247,197,54,0.3)",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 4,
  },
  addExerciseButtonText: {
    color: "#F7C536",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
