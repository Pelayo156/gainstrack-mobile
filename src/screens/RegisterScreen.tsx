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
} from "react-native";
import { APIGainstrackErrorResponse } from "../types/api.types";
import useAuthStore from "../store/useAuthStore";
import { authService } from "../services/authService";

export default function RegisterScreen() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    console.log("INICIO REGISTRO");

    setIsLoading(true);
    try {
      // Se valida que contraseñas sean iguales
      if (password !== confirmPassword) {
        setErrorMessage("Contraseñas no coinciden");
      } else {
        const response = await authService.register({
          email: email,
          password: password,
        });
        console.log(response);

        login(response.token, email);
      }
    } catch (error) {
      console.error(error);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["#0a0a0a", "#1a1a2e"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Text style={styles.textTitle}>Sign Up</Text>

          <View style={styles.containerInputLabel}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="example@domain.cl"
              placeholderTextColor="#666"
              style={styles.input}
            />
          </View>

          <View style={styles.containerInputLabel}>
            <Text style={styles.inputLabel}>Constraseña</Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={styles.input}
            />
          </View>

          <View style={styles.containerInputLabel}>
            <Text style={styles.inputLabel}>Confirmar constraseña</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry={true}
              style={styles.input}
            />
          </View>

          {errorMessage !== null && (
            <Text style={styles.errorText}>*{errorMessage}</Text>
          )}

          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Registrarse</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "20%",
    marginBottom: "10%",
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    gap: 35,
  },
  containerInputLabel: {
    gap: 5,
  },
  textTitle: {
    textAlign: "center",
    marginBottom: 35,
    color: "#F5F5F5",
    fontFamily: "Inter-Bold",
    fontSize: 40,
  },
  input: {
    width: "100%",
    padding: 12,
    backgroundColor: "#1a1a1a",
    color: "white",
    borderColor: "#333",
    borderWidth: 2,
    borderRadius: 10,
  },
  inputLabel: {
    color: "white",
    fontSize: 14,
    fontFamily: "Inter-Bold",
  },
  loginButton: {
    width: "100%",
    padding: 18,
    marginTop: 10,
    backgroundColor: "#007bff",
    borderRadius: 12,
  },
  loginButtonText: {
    color: "white",
    fontWeight: 700,
    textAlign: "center",
    fontSize: 15,
    fontFamily: "Inter-Bold",
  },
  errorText: {
    color: "red",
    fontWeight: 700,
    fontSize: 12,
  },
});
