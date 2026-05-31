import { View, Text, TouchableOpacity } from "react-native";
import useAuthStore from "../store/useAuthStore";

export default function RoutineScreen() {
  const { logout } = useAuthStore();

  return (
    <View>
      <Text>Pantalla de rutinas</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
