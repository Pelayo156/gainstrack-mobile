import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { authService } from "../services/authService";
import useAuthStore from "../store/useAuthStore";
import axios from "axios";
import { APIGainstrackErrorResponse } from "../types/api.types";
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
    loginButton: {
      backgroundColor: t.primary,
      borderRadius: 12,
      paddingVertical: 18,
      marginTop: 6,
    },
    loginButtonText: {
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
    registerText: {
      color: t.textTertiary,
      textAlign: "center",
      fontSize: 13,
      marginTop: 4,
    },
    socialContainer: {
      alignItems: "center",
      gap: 14,
      marginTop: 8,
    },
    socialLabel: {
      color: t.textDisabled,
      fontSize: 11,
      letterSpacing: 2,
    },
    googleButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
    },
  });
}

export default function LoginScreen({ navigation }: any) {
  const t = useAppTheme();
  const styles = useMemo(() => getStyles(t), [t]);

  const { login } = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      if (email.length > 0 && password.length > 0) {
        const response = await authService.login({ email, password });
        login(response.token, email);
      } else {
        setErrorMessage("Campos no pueden estar vacíos");
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

  const handleGoogleLogin = () => {
    console.log("INICIO LOGIN GOOGLE");
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
            <Text style={styles.textSubtitle}>CONTROLA TU PROGRESO</Text>
          </View>

          <View style={styles.card}>
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
                  setErrorMessage(null);
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
                  setErrorMessage(null);
                }}
                placeholder="Contraseña"
                placeholderTextColor={t.textTertiary}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          {errorMessage !== null && (
            <View style={styles.errorBanner}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={t.errorText}
              />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.loginButton}
            activeOpacity={0.7}
          >
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.6}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta? Regístrate
            </Text>
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            <Text style={styles.socialLabel}>o continúa con</Text>
            <TouchableOpacity
              onPress={handleGoogleLogin}
              style={styles.googleButton}
              activeOpacity={0.8}
            >
              <AntDesign name="google" size={22} color="#EA4335" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Modal visible={isLoading} transparent>
          <LoadingSpinner />
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}
