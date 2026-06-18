import { createStackNavigator } from "@react-navigation/stack";
import RoutineScreen from "../../screens/RoutinesScreen";
import EditRoutineScreen from "../../screens/EditRoutineScreen";

const Stack = createStackNavigator();

export default function RoutineStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Routines"
        component={RoutineScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditRoutine"
        component={EditRoutineScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
