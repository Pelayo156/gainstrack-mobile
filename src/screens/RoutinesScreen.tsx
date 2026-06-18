import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useEffect, useState } from "react";
import { APIGainstrackRoutineSummaryResponse } from "../types/routine.types";
import axios from "axios";
import { APIGainstrackErrorResponse } from "../types/api.types";
import { routineService } from "../services/routineService";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../store/useAuthStore";
import Toast from "react-native-toast-message";
import Popover from "react-native-popover-view";

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

export default function RoutineScreen({ navigation }: any) {
  const { logout } = useAuthStore();
  const { width } = useWindowDimensions();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [routinesItems, setRoutinesItems] = useState<
    APIGainstrackRoutineSummaryResponse[]
  >([]);
  const [isCreateRoutineModalOpen, setIsCreateRoutineModalOpen] =
    useState<boolean>(false);

  const [routineName, setRoutineName] = useState<string>("");
  const [routineNotes, setRoutineNotes] = useState<string>("");

  const [routineSelected, setRoutineSelected] =
    useState<APIGainstrackRoutineSummaryResponse | null>(null);

  const [isOptionsVisibles, setIsOptionVisibles] = useState<boolean>(false);

  const cardSize = width - H_PADDING * 2;

  /** Carga todas las rutinas del usuario al montar la pantalla */
  useEffect(() => {
    fetchRoutines();
  }, []);

  /** Inicia el flujo de ejecución de una rutina seleccionada */
  const handleStartRoutine = () => {
    console.log("INICIO DE RUTINA");
  };

  /** Realiza la petición al API y actualiza el estado con las rutinas o el error obtenido */
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

  /** Abre el modal de creación de rutina */
  const handleOpenCreateRoutineModal = () => {
    setRoutineName("");
    setRoutineNotes("");
    setIsCreateRoutineModalOpen(true);
  };

  const handleCreateRoutine = async () => {
    console.log("INICIO EVENTO CREAR RUTINA");

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await routineService.save({
        name: routineName,
        notes: routineNotes,
      });

      Toast.show({
        type: "success",
        text1: "Rutina creada",
        text2: response.name,
      });

      fetchRoutines();
      setIsCreateRoutineModalOpen(false);
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

  /** Cierra el modal de creación de rutina */
  const handleCloseCreateRoutineModal = () => {
    setIsCreateRoutineModalOpen(false);
  };

  const handleDeleteRoutine = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    if (routineSelected == null) {
      setErrorMessage("No se ha seleccionado una rutina para eliminar");
      return;
    }

    try {
      await routineService.delete(routineSelected?.id);
      fetchRoutines();

      Toast.show({
        type: "success",
        text1: `Rutina ${routineSelected?.name} eliminada`,
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

  return (
    <LinearGradient colors={["#080808", "#0f0f14"]} style={{ flex: 1 }}>
      <FlatList
        data={!isLoading && errorMessage === null ? routinesItems : []}
        keyExtractor={(routine) => routine.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.mainTitle}>Rutinas</Text>
              <Text style={styles.mainSubtitle}>TUS ENTRENAMIENTOS</Text>
            </View>

            <TouchableOpacity
              onPress={handleOpenCreateRoutineModal}
              style={styles.openModalButton}
              activeOpacity={0.8}
            >
              <Text style={styles.openModalButtonText}>+ Crear rutina</Text>
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

            {!isLoading &&
              routinesItems.length === 0 &&
              errorMessage === null && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No tienes rutinas aún</Text>
                </View>
              )}
          </>
        }
        renderItem={({ item: routine }) => (
          <LinearGradient
            colors={["rgba(255,255,255,0.13)", "rgba(255,255,255,0.04)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { width: cardSize }]}
          >
            <View>
              <View style={styles.cardTopRow}>
                <Text style={styles.routineName} numberOfLines={2}>
                  {routine.name}
                </Text>
                <Popover
                  isVisible={
                    routineSelected?.id === routine.id && isOptionsVisibles
                  }
                  onRequestClose={() => setIsOptionVisibles(false)}
                  from={(sourceRef, showPopover) => (
                    <TouchableOpacity
                      ref={sourceRef as any}
                      onPress={() => {
                        setRoutineSelected(routine);
                        setIsOptionVisibles(true);
                      }}
                      style={styles.optionsButton}
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
                      onPress={() => {
                        setIsOptionVisibles(false);
                        navigation.navigate("EditRoutine", {
                          routineId: routine.id,
                        });
                      }}
                    >
                      <Ionicons
                        name="create-outline"
                        size={16}
                        color="rgba(255,255,255,0.75)"
                      />
                      <Text style={styles.popoverItemText}>Editar</Text>
                    </TouchableOpacity>
                    <View style={styles.popoverDivider} />
                    <TouchableOpacity
                      style={styles.popoverItem}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="copy-outline"
                        size={16}
                        color="rgba(255,255,255,0.75)"
                      />
                      <Text style={styles.popoverItemText}>Duplicar</Text>
                    </TouchableOpacity>
                    <View style={styles.popoverDivider} />
                    <TouchableOpacity
                      onPress={handleDeleteRoutine}
                      style={styles.popoverItem}
                      activeOpacity={0.7}
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
        ListFooterComponent={
          <TouchableOpacity onPress={logout} style={styles.startButton}>
            <Text>Cerrar Sesión</Text>
          </TouchableOpacity>
        }
      />

      <Modal
        animationType="fade"
        visible={isCreateRoutineModalOpen}
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.centeredView}>
            <View style={styles.createRoutineModalView}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Nueva Rutina</Text>
                  <Text style={styles.modalSubtitle}>
                    CONFIGURA TU ENTRENAMIENTO
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleCloseCreateRoutineModal}
                  style={styles.modalCloseBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color="rgba(255,255,255,0.5)"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.modalInputCard}>
                <View style={styles.inputRow}>
                  <Ionicons
                    name="barbell-outline"
                    size={18}
                    color="rgba(255,255,255,0.4)"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={routineName}
                    onChangeText={(text) => {
                      setRoutineName(text);
                      setErrorMessage(null);
                    }}
                    placeholder="Nombre de la rutina"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.input}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.modalDivider} />
                <View style={styles.inputRow}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="rgba(255,255,255,0.4)"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={routineNotes}
                    onChangeText={(text) => {
                      setRoutineNotes(text);
                      setErrorMessage(null);
                    }}
                    placeholder="Notas (opcional)"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={[styles.input, styles.inputMultiline]}
                    autoCapitalize="sentences"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleCreateRoutine}
                style={styles.createButton}
                activeOpacity={0.8}
              >
                <Text style={styles.createButtonText}>Crear rutina</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 15,
    letterSpacing: 1,
  },
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 60,
    gap: CARD_GAP,
    paddingBottom: 32,
  },
  card: {
    borderColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  optionsButton: {
    padding: 4,
    marginLeft: 8,
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
  popoverItemText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  popoverItemDanger: {
    color: "rgba(255,75,75,0.9)",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  popoverDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  routineName: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 0.3,
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
  openModalButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  openModalButtonText: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    letterSpacing: 0.5,
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
  createRoutineModalView: {
    width: "100%",
    backgroundColor: "#0f0f14",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 22,
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    letterSpacing: 3,
    marginTop: 4,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalInputCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 20,
  },
  modalDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 20,
  },
  inputIcon: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
  },
  inputMultiline: {
    textAlignVertical: "top",
    paddingTop: 4,
    minHeight: 60,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  cancelButtonText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
