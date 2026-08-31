import axios from "axios";
import { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { APIGainstrackErrorResponse } from "../types/api.types";
import useAuthStore from "../store/useAuthStore";
import { authService } from "../services/authService";
import Toast from "react-native-toast-message";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAppTheme } from "../hooks/useAppTheme";
import { ThemeColors } from "../theme";

function getStyles(t: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 32,
      gap: 16,
    },
    header: {
      alignItems: "center",
      marginBottom: 20,
    },
    textTitle: {
      color: t.textPrimary,
      fontFamily: "Inter-Bold",
      fontSize: 38,
      letterSpacing: 1.5,
    },
    textSubtitle: {
      color: t.textTertiary,
      fontSize: 11,
      letterSpacing: 3,
      marginTop: 8,
    },
    card: {
      backgroundColor: t.surface,
      borderColor: t.surfaceBorder,
      borderWidth: 1,
      borderRadius: 18,
      overflow: "hidden",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 18,
    },
    icon: {
      marginRight: 14,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: t.divider,
      marginHorizontal: 20,
    },
    input: {
      flex: 1,
      color: t.textPrimary,
      fontSize: 15,
    },
    registerButton: {
      backgroundColor: t.primary,
      borderRadius: 12,
      paddingVertical: 18,
      marginTop: 6,
    },
    registerButtonText: {
      color: t.primaryOnPrimary,
      fontFamily: "Inter-Bold",
      fontSize: 16,
      textAlign: "center",
      letterSpacing: 0.5,
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
  });
}

export default function RegisterScreen() {
  const t = useAppTheme();
  const styles = useMemo(() => getStyles(t), [t]);

  const { login } = useAuthStore();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleRegister = async () => {
    console.log("INICIO REGISTRO");

    setIsLoading(true);
    setErrorMessages([]);
    try {
      // Se valida que contraseñas sean iguales
      if (password !== confirmPassword) {
        setErrorMessages(["Contraseñas no coinciden"]);
      } else {
        const response = await authService.register({
          name: name,
          email: email,
          password: password,
        });
        console.log(response);

        login(response.token, email);
        Toast.show({
          type: "success",
          text1: "Cuenta creada",
          text2: "¡Bienvenido a GainsTrack!",
        });
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIGainstrackErrorResponse;
        if (apiError.errors != null) {
          setErrorMessages(Object.values(apiError.errors));
        } else {
          setErrorMessages([apiError.message]);
        }
      } else {
        setErrorMessages(["Error inesperado, intente nuevamente"]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: t.background }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.textTitle}>GainsTrack</Text>
            <Text style={styles.textSubtitle}>CREA TU CUENTA</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputRow}>
              <Ionicons
                name="person-outline"
                size={18}
                color={t.textTertiary}
                style={styles.icon}
              />
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setErrorMessages([]);
                }}
                placeholder="Nombre"
                placeholderTextColor={t.textTertiary}
                style={styles.input}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={t.textTertiary}
                style={styles.icon}
              />
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMessages([]);
                }}
                placeholder="Correo electrónico"
                placeholderTextColor={t.textTertiary}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={t.textTertiary}
                style={styles.icon}
              />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMessages([]);
                }}
                placeholder="Contraseña"
                placeholderTextColor={t.textTertiary}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={t.textTertiary}
                style={styles.icon}
              />
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrorMessages([]);
                }}
                placeholder="Confirmar contraseña"
                placeholderTextColor={t.textTertiary}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          {errorMessages.length > 0 &&
            errorMessages.map((errorMessage, index) => (
              <View key={index} style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={t.errorText}
                />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ))}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            style={styles.registerButton}
            activeOpacity={0.7}
          >
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <Modal visible={isLoading} transparent>
          <LoadingSpinner />
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}
