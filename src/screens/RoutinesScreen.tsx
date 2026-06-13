import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
  FlatList,
} from "react-native";
import useAuthStore from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { APIGainstrackRoutineSummaryResponse } from "../types/routine.types";
import axios from "axios";
import { APIGainstrackErrorResponse } from "../types/api.types";
import { routineService } from "../services/routineService";
import { LinearGradient } from "expo-linear-gradient";

export default function RoutineScreen() {
  const { logout } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [routinesItems, setRoutinesItems] = useState<
    APIGainstrackRoutineSummaryResponse[]
  >([]);

  useEffect(() => {
    console.log("INICIO PANTALLA DE RUTINAS");

    const fetchRoutine = async () => {
      console.log("INICIO CARGA RUTINAS");
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await routineService.findAll();
        setRoutinesItems(response);
        console.log("Rutinas cargadas exitosamente");
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
    fetchRoutine();
  }, []);

  const handleStartRoutine = () => {
    console.log("INICIO DE RUTINA");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["#080808", "#0f0f14"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          {routinesItems.length > 0 && (
            <View>
              <Text style={styles.mainTitle}>Rutinas</Text>

              <FlatList
                data={routinesItems}
                keyExtractor={(routine) => routine.id.toString()}
                renderItem={({ item: routine }) => (
                  <View key={routine.id} style={styles.card}>
                    <Text style={styles.routineTitle}>{routine.name}</Text>
                    <Text style={styles.routineDescription}>
                      {routine.notes === null ? "Sin notas" : routine.notes}
                    </Text>

                    <TouchableOpacity
                      onPress={handleStartRoutine}
                      disabled={isLoading}
                      style={styles.startRoutineButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.loginButtonText}>
                        Comenzar rutina
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              {routinesItems.map((routine, index) => (
                <View key={routine.id} style={styles.card}>
                  <Text style={styles.routineTitle}>{routine.name}</Text>
                  <Text style={styles.routineDescription}>
                    {routine.notes === null ? "Sin notas" : routine.notes}
                  </Text>

                  <TouchableOpacity
                    onPress={handleStartRoutine}
                    disabled={isLoading}
                    style={styles.startRoutineButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.loginButtonText}>Comenzar rutina</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 32,
    gap: 16,
  },
  mainTitle: {
    color: "white",
    fontSize: 30,
    fontWeight: 600,
  },
  card: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  routineTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: 400,
  },
  routineDescription: {
    color: "gray",
  },
  startRoutineButton: {
    padding: 5,
    backgroundColor: "blue",
  },
  loginButtonText: {
    color: "white",
  },
});
