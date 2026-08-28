import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuthStore from "../../store/useAuthStore";
import AuthNavigator from "./AuthNavigator";
import RoutineStackNavigator from "./RoutineStackNavigator";
import HistoryStackNavigator from "./HistoryStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const TAB_BAR_STYLE = {
  backgroundColor: "#1A1A1A",
  borderTopColor: "#2A2A2A",
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
        tabBarActiveTintColor: "#AAFF00",
        tabBarInactiveTintColor: "rgba(255,255,255,0.3)",
        tabBarLabelStyle: TAB_BAR_LABEL_STYLE,
        headerShown: false,
        sceneStyle: {
          backgroundColor: "#121212",
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
            getFocusedRouteNameFromRoute(route) === "ExercisePicker" ||
            getFocusedRouteNameFromRoute(route) === "GymPicker" ||
            getFocusedRouteNameFromRoute(route) === "ActiveTrainingSession" ||
            getFocusedRouteNameFromRoute(route) === "TrainingSessionSummary"
              ? { display: "none" }
              : TAB_BAR_STYLE,
        })}
      />
      <Tab.Screen
        name="Historial"
        component={HistoryStackNavigator}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
          tabBarStyle:
            getFocusedRouteNameFromRoute(route) === "TrainingSessionDetail"
              ? { display: "none" }
              : TAB_BAR_STYLE,
        })}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  ) : (
    <AuthNavigator />
  );
}
