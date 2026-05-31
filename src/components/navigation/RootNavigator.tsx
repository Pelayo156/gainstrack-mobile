import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HistoryScreen from "../../screens/HistoryScreen";
import RoutineScreen from "../../screens/RoutinesScreen";
import useAuthStore from "../../store/useAuthStore";
import AuthNavigator from "./AuthNavigator";

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  const { token } = useAuthStore();

  return token !== null ? (
    <Tab.Navigator>
      <Tab.Screen name="Rutinas" component={RoutineScreen} />
      <Tab.Screen name="Historial" component={HistoryScreen} />
    </Tab.Navigator>
  ) : (
    <AuthNavigator />
  );
}
