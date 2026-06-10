import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
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

export default function RegisterScreen() {
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
      <LinearGradient colors={["#080808", "#0f0f14"]} style={{ flex: 1 }}>
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
                color="rgba(255,255,255,0.4)"
                style={styles.icon}
              />
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setErrorMessages([]);
                }}
                placeholder="Nombre"
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={styles.input}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="rgba(255,255,255,0.4)"
                style={styles.icon}
              />
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMessages([]);
                }}
                placeholder="Correo electrónico"
                placeholderTextColor="rgba(255,255,255,0.3)"
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
                color="rgba(255,255,255,0.4)"
                style={styles.icon}
              />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMessages([]);
                }}
                placeholder="Contraseña"
                placeholderTextColor="rgba(255,255,255,0.3)"
                secureTextEntry
                style={styles.input}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="rgba(255,255,255,0.4)"
                style={styles.icon}
              />
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrorMessages([]);
                }}
                placeholder="Confirmar contraseña"
                placeholderTextColor="rgba(255,255,255,0.3)"
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
                  color="rgba(255,90,90,0.9)"
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
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 38,
    letterSpacing: 1.5,
  },
  textSubtitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 8,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.09)",
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
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
  },
  registerButton: {
    backgroundColor: "rgba(255,255,255,0.09)",
    borderColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 18,
    marginTop: 6,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 0.5,
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
});
