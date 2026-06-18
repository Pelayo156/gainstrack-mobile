import { Text } from "react-native";

export default function EditRoutineScreen({ route }: any) {
  const { routineId } = route.params;

  return (
    <>
      <Text>Pantalla para editar rutina con ID {routineId}</Text>
    </>
  );
}
