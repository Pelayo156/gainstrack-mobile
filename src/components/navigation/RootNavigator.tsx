import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HistoryScreen from "../../screens/HistoryScreen";
import useAuthStore from "../../store/useAuthStore";
import AuthNavigator from "./AuthNavigator";
import RoutineStackNavigator from "./RoutineStackNavigator";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  const { token } = useAuthStore();

  return token !== null ? (
    <Tab.Navigator>
      <Tab.Screen
        name="Rutinas"
        component={RoutineStackNavigator}
        options={({ route }) => ({
          tabBarStyle:
            getFocusedRouteNameFromRoute(route) === "EditRoutine"
              ? { display: "none" }
              : undefined,
        })}
      />
      <Tab.Screen name="Historial" component={HistoryScreen} />
    </Tab.Navigator>
  ) : (
    <AuthNavigator />
  );
}
