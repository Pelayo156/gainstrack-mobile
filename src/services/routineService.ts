import {
  APIGainsTrackRoutineDetailResponse,
  APIGainstrackRoutineSummaryResponse,
  APIGainstrackSaveRoutineRequest,
  Set,
} from "../types/routine.types";
import apiClient from "./apiClient";

export const routineService = {
  findAll: async (): Promise<APIGainstrackRoutineSummaryResponse[]> => {
    const response = await apiClient.get("/routines");
    return response.data;
  },
  save: async (
    saveRequest: APIGainstrackSaveRoutineRequest
  ): Promise<APIGainstrackRoutineSummaryResponse> => {
    const response = await apiClient.post("/routines", saveRequest);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/routines/${id}`);
  },
  findById: async (id: number): Promise<APIGainsTrackRoutineDetailResponse> => {
    const response = await apiClient.get(`/routines/${id}`);
    return response.data;
  },
  updateExerciseSet: async (
    id: number,
    routineExerciseId: number,
    routineExerciseSet: Set
  ): Promise<APIGainsTrackRoutineDetailResponse> => {
    const response = await apiClient.patch(
      `/routines/${id}/exercises/${routineExerciseId}/sets/${routineExerciseSet.id}`,
      routineExerciseSet
    );
    return response.data;
  },
  deleteExerciseById: async (id: number, exerciseId: number) => {
    const response = await apiClient.delete(
      `/routines/${id}/exercises/${exerciseId}`
    );
    return response.data;
  },
};
