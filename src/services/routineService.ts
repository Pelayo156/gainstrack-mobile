import {
  APIGainsTrackRoutineDetailResponse,
  APIGainstrackRoutineSummaryResponse,
  APIGainsTrackSaveExerciseRoutine,
  APIGainstrackSaveRoutineExerciseSet,
  APIGainstrackSaveRoutineRequest,
  RoutineExercise,
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
  saveExercise: async (
    id: number,
    saveRequest: APIGainsTrackSaveExerciseRoutine
  ): Promise<RoutineExercise> => {
    const response = await apiClient.post(
      `/routines/${id}/exercises`,
      saveRequest
    );
    return response.data;
  },
  saveSet: async (
    id: number,
    exerciseId: number,
    saveRequest: APIGainstrackSaveRoutineExerciseSet
  ): Promise<APIGainsTrackRoutineDetailResponse> => {
    const response = await apiClient.post(
      `/routines/${id}/exercises/${exerciseId}/sets`,
      saveRequest
    );
    return response.data;
  },
  deleteSetById: async (
    id: number,
    exerciseId: number,
    setId: number
  ): Promise<APIGainsTrackRoutineDetailResponse> => {
    const response = await apiClient.delete(
      `/routines/${id}/exercises/${exerciseId}/sets/${setId}`
    );
    return response.data;
  },
};
