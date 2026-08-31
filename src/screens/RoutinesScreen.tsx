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
import { useCallback, useEffect, useMemo, useState } from "react";
import { APIGainstrackRoutineSummaryResponse } from "../types/routine.types";
import axios from "axios";
import { APIGainstrackErrorResponse } from "../types/api.types";
import { routineService } from "../services/routineService";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import Popover from "react-native-popover-view";
import { useFocusEffect } from "@react-navigation/native";
import GlassCard from "../components/ui/GlassCard";
import ScreenHeader from "../components/ui/ScreenHeader";
import useActiveTrainingSessionStore from "../store/useActiveTrainingSessionStore";
import ActiveSessionFAB from "../components/ui/ActiveSessionFAB";
import { useAppTheme } from "../hooks/useAppTheme";
import { ThemeColors } from "../theme";

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

function getStyles(t: ThemeColors) {
  return StyleSheet.create({
    centeredView: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.75)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    header: {
      marginBottom: 28,
    },
    errorBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: t.errorBg,
      borderColor: t.errorBorder,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    errorText: {
      flex: 1,
      color: t.errorText,
      fontSize: 14,
    },
    emptyContainer: {
      marginTop: 60,
      alignItems: "center",
    },
    emptyText: {
      color: t.textTertiary,
      fontSize: 15,
      letterSpacing: 1,
    },
    listContent: {
      paddingHorizontal: H_PADDING,
      paddingTop: 20,
      gap: CARD_GAP,
      paddingBottom: 32,
    },
    card: {
      borderRadius: 24,
      padding: 18,
      justifyContent: "space-between",
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
      backgroundColor: t.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: t.surfaceBorder,
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
      color: t.textPrimary,
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
      backgroundColor: t.divider,
    },
    routineName: {
      flex: 1,
      color: t.textPrimary,
      fontFamily: "Inter-Bold",
      fontSize: 15,
      letterSpacing: 0.3,
    },
    routineNotes: {
      color: t.textTertiary,
      fontSize: 12,
      lineHeight: 17,
    },
    routineDate: {
      color: t.textDisabled,
      fontSize: 10,
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    openModalButton: {
      backgroundColor: t.divider,
      borderColor: t.surfaceBorder,
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      marginBottom: 20,
    },
    openModalButtonText: {
      color: t.textPrimary,
      fontFamily: "Inter-Bold",
      fontSize: 15,
      letterSpacing: 0.5,
    },
    createButton: {
      backgroundColor: t.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      marginBottom: 20,
    },
    createButtonText: {
      color: t.primaryOnPrimary,
      fontFamily: "Inter-Bold",
      fontSize: 16,
      letterSpacing: 0.5,
    },
    startButton: {
      backgroundColor: t.primary,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: "center",
    },
    startButtonText: {
      color: t.primaryOnPrimary,
      fontFamily: "Inter-Bold",
      fontSize: 13,
      letterSpacing: 0.5,
    },
    createRoutineModalView: {
      width: "100%",
      backgroundColor: t.surface,
      borderRadius: 28,
      padding: 24,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 24,
    },
    modalTitle: {
      color: t.textPrimary,
      fontFamily: "Inter-Bold",
      fontSize: 22,
      letterSpacing: 0.5,
    },
    modalSubtitle: {
      color: t.textTertiary,
      fontSize: 10,
      letterSpacing: 3,
      marginTop: 4,
    },
    modalCloseBtn: {
      padding: 4,
    },
    modalInputCard: {
      borderRadius: 20,
      padding: 0,
      marginBottom: 20,
    },
    modalDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: t.divider,
      marginHorizontal: 20,
    },
    inputIcon: {
      marginRight: 14,
    },
    input: {
      flex: 1,
      color: t.textPrimary,
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
      color: t.textDisabled,
      fontSize: 14,
      letterSpacing: 0.5,
    },
  });
}

export default function RoutineScreen({ navigation }: any) {
  const t = useAppTheme();
  const styles = useMemo(() => getStyles(t), [t]);

  const { activeTrainingSession } = useActiveTrainingSessionStore();
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
  useFocusEffect(
    useCallback(() => {
      fetchRoutines();
    }, []),
  );

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
    <View style={{ flex: 1, backgroundColor: t.background }}>
      <FlatList
        data={!isLoading && errorMessage === null ? routinesItems : []}
        keyExtractor={(routine) => routine.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          activeTrainingSession !== null && { paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <ScreenHeader
              title="Rutinas"
              subtitle="TUS ENTRENAMIENTOS"
              style={styles.header}
            />

            <TouchableOpacity
              onPress={handleOpenCreateRoutineModal}
              style={styles.openModalButton}
              activeOpacity={0.8}
            >
              <Text style={styles.openModalButtonText}>+ Crear rutina</Text>
            </TouchableOpacity>

            {isLoading && (
              <ActivityIndicator
                color={t.primary}
                size="large"
                style={{ marginTop: 40 }}
              />
            )}

            {!isLoading && errorMessage !== null && (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={t.errorText}
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
          <GlassCard
            intensity="strong"
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
                        color={t.textTertiary}
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
                        color={t.textSecondary}
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
                        color={t.textSecondary}
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
                onPress={() => {
                  navigation.navigate("GymPicker", {
                    routineId: routine.id,
                  });
                }}
                style={styles.startButton}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Iniciar</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        )}
      />

      <Modal
        animationType="fade"
        visible={isCreateRoutineModalOpen}
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.centeredView}>
            <GlassCard intensity="strong" style={styles.createRoutineModalView}>
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
                    color={t.textTertiary}
                  />
                </TouchableOpacity>
              </View>

              <GlassCard intensity="subtle" style={styles.modalInputCard}>
                <View style={styles.inputRow}>
                  <Ionicons
                    name="barbell-outline"
                    size={18}
                    color={t.textTertiary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={routineName}
                    onChangeText={(text) => {
                      setRoutineName(text);
                      setErrorMessage(null);
                    }}
                    placeholder="Nombre de la rutina"
                    placeholderTextColor={t.textTertiary}
                    style={styles.input}
                    autoCapitalize="sentences"
                  />
                </View>
                <View style={styles.modalDivider} />
                <View style={styles.inputRow}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={t.textTertiary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={routineNotes}
                    onChangeText={(text) => {
                      setRoutineNotes(text);
                      setErrorMessage(null);
                    }}
                    placeholder="Notas (opcional)"
                    placeholderTextColor={t.textTertiary}
                    style={[styles.input, styles.inputMultiline]}
                    autoCapitalize="sentences"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </GlassCard>

              <TouchableOpacity
                onPress={handleCreateRoutine}
                style={styles.createButton}
                activeOpacity={0.8}
              >
                <Text style={styles.createButtonText}>Crear rutina</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ActiveSessionFAB
        onPress={() => {
          navigation.navigate("ActiveTrainingSession");
        }}
      />
    </View>
  );
}
