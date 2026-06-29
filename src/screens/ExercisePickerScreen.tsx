import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { exerciseService } from "../services/exerciseService";
import { APIGainsTrackExerciseResponse } from "../types/exercise.types";
import axios from "axios";
import { APIGainstrackErrorResponse } from "../types/api.types";

const H_PADDING = 20;

export default function ExercisePickerScreen({ route, navigation }: any) {
  const { routineId } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exercises, setExercises] = useState<APIGainsTrackExerciseResponse[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
    null
  );

  useEffect(() => {
    console.log(`INICIO VISTA DE EJERCICIOS PARA RUTINA CON ID: ${routineId}`);

    const fetchRoutineById = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await exerciseService.findAll();
        setExercises(response);
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
          Agregar ejercicio
        </Text>
        <View style={styles.headerIconButton} />
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color="rgba(255,255,255,0.35)"
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar ejercicio..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={styles.searchInput}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color="rgba(255,255,255,0.3)"
              />
            </TouchableOpacity>
          )}
        </View>
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

      {!isLoading && errorMessage === null && (
        <FlatList
          data={exercises}
          keyExtractor={(exercise) => exercise.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="barbell-outline"
                size={40}
                color="rgba(255,255,255,0.1)"
              />
              <Text style={styles.emptyText}>No se encontraron ejercicios</Text>
            </View>
          }
          renderItem={({ item: exercise }) => {
            const isSelected = selectedExerciseId === exercise.id;
            return (
              <TouchableOpacity
                onPress={() =>
                  setSelectedExerciseId(isSelected ? null : exercise.id)
                }
                style={[
                  styles.exerciseCard,
                  isSelected && styles.exerciseCardSelected,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.exerciseInfo}>
                  <Text
                    style={[
                      styles.exerciseName,
                      isSelected && styles.exerciseNameSelected,
                    ]}
                    numberOfLines={2}
                  >
                    {exercise.name}
                  </Text>
                  <View style={styles.exerciseTagsRow}>
                    <View
                      style={[
                        styles.muscleGroupPill,
                        isSelected && styles.muscleGroupPillSelected,
                      ]}
                    >
                      <Text style={styles.muscleGroupPillText}>
                        {exercise.muscleGroup.name}
                      </Text>
                    </View>
                    {exercise.isPredefined && (
                      <View style={styles.predefinedPill}>
                        <Text style={styles.predefinedPillText}>
                          Predefinido
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View
                  style={[
                    styles.selectionCircle,
                    isSelected && styles.selectionCircleSelected,
                  ]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color="#080808" />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            selectedExerciseId === null && styles.confirmButtonDisabled,
          ]}
          activeOpacity={0.8}
          disabled={selectedExerciseId === null}
        >
          <Text
            style={[
              styles.confirmButtonText,
              selectedExerciseId === null && styles.confirmButtonTextDisabled,
            ]}
          >
            Agregar ejercicio
          </Text>
        </TouchableOpacity>
      </View>
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
  searchRow: {
    paddingHorizontal: H_PADDING,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
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
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 16,
    gap: 10,
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: "center",
    gap: 14,
  },
  emptyText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  exerciseCardSelected: {
    backgroundColor: "rgba(227,179,65,0.08)",
    borderColor: "rgba(227,179,65,0.5)",
  },
  exerciseInfo: {
    flex: 1,
    gap: 8,
  },
  exerciseName: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  exerciseNameSelected: {
    color: "#E3B341",
  },
  exerciseTagsRow: {
    flexDirection: "row",
    gap: 8,
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
  muscleGroupPillSelected: {
    backgroundColor: "rgba(227,179,65,0.2)",
    borderColor: "rgba(227,179,65,0.6)",
  },
  muscleGroupPillText: {
    color: "#E3B341",
    fontSize: 11,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.5,
  },
  predefinedPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  predefinedPillText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  selectionCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  selectionCircleSelected: {
    backgroundColor: "#E3B341",
    borderColor: "#E3B341",
  },
  footer: {
    paddingHorizontal: H_PADDING,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  confirmButton: {
    backgroundColor: "#E3B341",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "rgba(227,179,65,0.2)",
  },
  confirmButtonText: {
    color: "#080808",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  confirmButtonTextDisabled: {
    color: "rgba(227,179,65,0.5)",
  },
});
