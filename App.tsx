import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingSpinner from "./src/components/ui/LoadingSpinner";
import RootNavigator from "./src/components/navigation/RootNavigator";
import useAuthStore from "./src/store/useAuthStore";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import Toast from "react-native-toast-message";
import useActiveTrainingSessionStore from "./src/store/useActiveTrainingSessionStore";
import { APIGainstrackTrainingSessionDetailResponse } from "./src/types/trainingSession.types";

function AppContent() {
  const insets = useSafeAreaInsets();
  return (
    <>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <Toast topOffset={insets.top + 10} />
    </>
  );
}

export default function App() {
  const { login, isLoading, setIsLoading } = useAuthStore();
  const { restoreTrainingSession, setStartTimestamp } =
    useActiveTrainingSessionStore();
  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Bold": Inter_700Bold,
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        // verificar autenticación
        const token = await AsyncStorage.getItem("token");
        const email = await AsyncStorage.getItem("email");
        if (token !== null && email !== null) {
          login(token, email);
        }

        // verificar sesión de entrenamiento activa
        const originalTrainingSession = await AsyncStorage.getItem(
          "originalTrainingSession",
        );
        const activeTrainingSession = await AsyncStorage.getItem(
          "activeTrainingSession",
        );
        const completedSetIds = await AsyncStorage.getItem(
          "completedSetIds",
        );
        const startTimestamp = await AsyncStorage.getItem("startTimestamp");
        if (
          originalTrainingSession !== null &&
          activeTrainingSession !== null &&
          startTimestamp !== null
        ) {
          restoreTrainingSession({
            originalTrainingSession: JSON.parse(
              originalTrainingSession,
            ) as APIGainstrackTrainingSessionDetailResponse,
            activeTrainingSession: JSON.parse(
              activeTrainingSession,
            ) as APIGainstrackTrainingSessionDetailResponse,
            completedSetIds:
              completedSetIds !== null
                ? (JSON.parse(completedSetIds) as number[])
                : [],
          });
          setStartTimestamp(Number(startTimestamp));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  if (!fontsLoaded || isLoading) return <LoadingSpinner />;

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
