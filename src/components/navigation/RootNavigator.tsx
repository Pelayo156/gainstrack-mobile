import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HistoryScreen from "../../screens/HistoryScreen";
import useAuthStore from "../../store/useAuthStore";
import AuthNavigator from "./AuthNavigator";
import RoutineStackNavigator from "./RoutineStackNavigator";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const TAB_BAR_STYLE = {
  backgroundColor: "#0f0f14",
  borderTopColor: "rgba(255,255,255,0.1)",
  borderTopWidth: 1,
  height: 80,
  paddingTop: 8,
  paddingBottom: 24,
};

const TAB_BAR_LABEL_STYLE = {
  fontFamily: "Inter-Bold",
  fontSize: 11,
  letterSpacing: 0.3,
};

export default function RootNavigator() {
  const { token } = useAuthStore();
  const insets = useSafeAreaInsets();

  return token !== null ? (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: TAB_BAR_STYLE,
        tabBarActiveTintColor: "#E3B341",
        tabBarInactiveTintColor: "rgba(255,255,255,0.3)",
        tabBarLabelStyle: TAB_BAR_LABEL_STYLE,
        headerShown: false,
        sceneStyle: {
          backgroundColor: "#080808",
          paddingTop: insets.top + 12,
        },
      }}
    >
      <Tab.Screen
        name="Rutinas"
        component={RoutineStackNavigator}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={size} color={color} />
          ),
          tabBarStyle:
            getFocusedRouteNameFromRoute(route) === "EditRoutine" ||
            getFocusedRouteNameFromRoute(route) === "ExercisePicker"
              ? { display: "none" }
              : TAB_BAR_STYLE,
        })}
      />
      <Tab.Screen
        name="Historial"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  ) : (
    <AuthNavigator />
  );
}
