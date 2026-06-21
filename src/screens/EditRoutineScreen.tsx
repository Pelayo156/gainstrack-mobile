import { useEffect, useState } from "react";
import { Text } from "react-native";
import { routineService } from "../services/routineService";
import { APIGainsTrackRoutineDetailResponse } from "../types/routine.types";
import axios from "axios";
import { APIGainstrackErrorResponse } from "../types/api.types";

export default function EditRoutineScreen({ route }: any) {
  const { routineId } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [routine, setRoutine] =
    useState<APIGainsTrackRoutineDetailResponse | null>(null);

  useEffect(() => {
    console.log("INICIO VISTA EDITAR RUTINA");

    const fetchRoutineById = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await routineService.findById(routineId);
        setRoutine(response);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const apiError = error.response?.data as APIGainstrackErrorResponse;
          setErrorMessage(apiError.message);
        } else {
          setErrorMessage("Error inesperado, intente nuevamente");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutineById();
  }, []);

  return (
    <>
      <Text>Pantalla para editar rutina {routine?.name}</Text>
    </>
  );
}
