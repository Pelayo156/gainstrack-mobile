import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { APIGainstrackRoutineSummaryResponse } from "../types/routine.types";
import axios from "axios";
import { APIGainstrackErrorResponse } from "../types/api.types";
import { routineService } from "../services/routineService";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../store/useAuthStore";

const H_PADDING = 20;
const CARD_GAP = 12;
const SMALL_SCREEN_BREAKPOINT = 360;

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RoutineScreen() {
  const { logout } = useAuthStore();
  const { width } = useWindowDimensions();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [routinesItems, setRoutinesItems] = useState<
    APIGainstrackRoutineSummaryResponse[]
  >([]);

  const numColumns = width < SMALL_SCREEN_BREAKPOINT ? 1 : 2;
  const cardSize =
    numColumns === 2
      ? (width - H_PADDING * 2 - CARD_GAP) / 2
      : width - H_PADDING * 2;

  useEffect(() => {
    const fetchRoutines = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await routineService.findAll();
        setRoutinesItems(response);
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
    fetchRoutines();
  }, []);

  const handleStartRoutine = () => {
    console.log("INICIO DE RUTINA");
  };

  const handleCreateRoutine = () => {
    console.log("CREAR RUTINA");
  };

  return (
    <LinearGradient colors={["#080808", "#0f0f14"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Rutinas</Text>
          <Text style={styles.mainSubtitle}>TUS ENTRENAMIENTOS</Text>
        </View>

        <TouchableOpacity
          onPress={handleCreateRoutine}
          style={styles.createButton}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>+ Crear rutina</Text>
        </TouchableOpacity>

        {isLoading && (
          <ActivityIndicator
            color="#FAD141"
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

        {!isLoading && routinesItems.length === 0 && errorMessage === null && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes rutinas aún</Text>
          </View>
        )}

        {!isLoading && routinesItems.length > 0 && (
          <FlatList
            key={numColumns}
            data={routinesItems}
            keyExtractor={(routine) => routine.id.toString()}
            numColumns={numColumns}
            columnWrapperStyle={numColumns === 2 ? styles.row : undefined}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: routine }) => (
              <LinearGradient
                colors={["rgba(255,255,255,0.13)", "rgba(255,255,255,0.04)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.card,
                  {
                    width: cardSize,
                    height: numColumns === 2 ? cardSize : undefined,
                  },
                ]}
              >
                <View>
                  <Text style={styles.routineName} numberOfLines={2}>
                    {routine.name}
                  </Text>
                  <Text style={styles.routineNotes} numberOfLines={4}>
                    {routine.notes ?? "Sin notas"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.routineDate}>
                    {formatDate(routine.createdAt)}
                  </Text>
                  <TouchableOpacity
                    onPress={handleStartRoutine}
                    style={styles.startButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.startButtonText}>Iniciar</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            )}
          />
        )}
        <TouchableOpacity onPress={logout} style={styles.startButton}>
          <Text>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: H_PADDING,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  mainTitle: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 38,
    letterSpacing: 1.5,
  },
  mainSubtitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 8,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 15,
    letterSpacing: 1,
  },
  listContent: {
    gap: CARD_GAP,
    paddingBottom: 32,
  },
  row: {
    gap: CARD_GAP,
  },
  card: {
    borderColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  routineName: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  routineNotes: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 12,
    lineHeight: 17,
  },
  routineDate: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: "#FAD141",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  createButtonText: {
    color: "#080808",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  startButton: {
    backgroundColor: "#FAD141",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  startButtonText: {
    color: "#080808",
    fontFamily: "Inter-Bold",
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
