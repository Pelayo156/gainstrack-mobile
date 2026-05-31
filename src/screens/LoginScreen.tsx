import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { authService } from "../services/authService";
import useAuthStore from "../store/useAuthStore";
import axios from "axios";
import { APIGainstrackErrorResponse } from "../types/api.types";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function LoginScreen() {
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
    <KeyboardAvoidingView>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={(text) => setEmail(text)} />

      <Text>Constraseña</Text>
      <TextInput value={password} onChangeText={(text) => setPassword(text)} />

      {errorMessage !== null && <Text>*{errorMessage}</Text>}

      <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
        <Text>Iniciar sesión</Text>
      </TouchableOpacity>

      <Modal visible={isLoading} transparent>
        <LoadingSpinner />
      </Modal>
    </KeyboardAvoidingView>
  );
}
