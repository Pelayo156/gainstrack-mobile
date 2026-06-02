import { useState } from "react";
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
import { authService } from "../services/authService";
import useAuthStore from "../store/useAuthStore";
import axios from "axios";
import { APIGainstrackErrorResponse } from "../types/api.types";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    console.log("INICIO LOGIN");

    setIsLoading(true);
    try {
      if (email.length > 0 && password.length > 0) {
        const response = await authService.login({
          email: email,
          password: password,
        });
        console.log(response);

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["#0a0a0a", "#1a1a2e"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Text style={styles.textTitle}>GainsTrack</Text>

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

          {errorMessage !== null && (
            <Text style={styles.errorText}>*{errorMessage}</Text>
          )}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>

          <Modal visible={isLoading} transparent>
            <LoadingSpinner />
          </Modal>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "20%",
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    gap: 20,
  },
  containerInputLabel: {
    gap: 5,
  },
  textTitle: {
    marginBottom: 40,
    color: "#007bff",
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
    borderRadius: 8,
  },
  inputLabel: {
    color: "white",
    fontSize: 16,
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
