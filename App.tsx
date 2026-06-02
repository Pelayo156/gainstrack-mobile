import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingSpinner from "./src/components/ui/LoadingSpinner";
import RootNavigator from "./src/components/navigation/RootNavigator";
import useAuthStore from "./src/store/useAuthStore";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";

export default function App() {
  const { login, isLoading, setIsLoading } = useAuthStore();
  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Bold": Inter_700Bold,
  });

  useEffect(() => {
    const verifyUserIsAuthenticated = async () => {
      try {
        // Se verifica que usuario esté logueado al abrir la app
        const token = await AsyncStorage.getItem("token");
        const email = await AsyncStorage.getItem("email");

        if (token !== null && email !== null) {
          login(token, email);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUserIsAuthenticated();
  }, []);

  if (!fontsLoaded || isLoading) return <LoadingSpinner />;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
