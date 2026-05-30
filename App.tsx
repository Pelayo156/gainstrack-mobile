import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./components/navigation/RootNavigator";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "./store/useAuthStore";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function App() {
  const { login, isLoading, setIsLoading } = useAuthStore();

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

  return (
    <SafeAreaProvider>
      {isLoading ? (
        <View style={styles.containerContentCenter}>
          <ActivityIndicator />
        </View>
      ) : (
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containerContentCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
