import {
  APIGainsTrackSaveExerciseTrainingSessionRequest,
  APIGainstrackSaveTrainingSessionExerciseSet,
  APIGainstrackSaveTrainingSessionRequest,
  APIGainstrackTrainingSessionDetailResponse,
  APIGainstrackTrainingSessionSummaryResponse,
  APIGainstrackUpdateExerciseTrainingSessionRequest,
  APIGainstrackUpdateTrainingSessionRequest,
  TrainingSessionSet,
} from "../types/trainingSession.types";
import apiClient from "./apiClient";

export const trainingSessionService = {
  findAll: async (): Promise<APIGainstrackTrainingSessionSummaryResponse[]> => {
    const response = await apiClient.get("/sessions");
    return response.data;
  },
  findById: async (
    id: number,
  ): Promise<APIGainstrackTrainingSessionDetailResponse> => {
    const response = await apiClient.get(`/sessions/${id}`);
    return response.data;
  },
  findfindAllByRoutineAndGym: async (
    routineId: number,
    gymId: number,
  ): Promise<APIGainstrackTrainingSessionSummaryResponse[]> => {
    const response = await apiClient.get(
      `/sessions/history?routineId=${routineId}&gymId=${gymId}`,
    );
    return response.data;
  },
  preview: async (
    routineId: number,
    gymId: number,
  ): Promise<APIGainstrackTrainingSessionDetailResponse> => {
    const response = await apiClient.get(
      `/sessions/preview?routineId=${routineId}&gymId=${gymId}`,
    );
    return response.data;
  },
  save: async (saveRequest: APIGainstrackSaveTrainingSessionRequest) => {
    const response = await apiClient.post("/sessions", saveRequest);
    return response.data;
  },
  deleteById: async (id: number) => {
    const response = await apiClient.delete(`/sessions/${id}`);
    return response.data;
  },
  updateSession: async (
    id: number,
    updateRequest: APIGainstrackUpdateTrainingSessionRequest,
  ): Promise<APIGainstrackTrainingSessionDetailResponse> => {
    const response = await apiClient.patch(`/sessions/${id}`, updateRequest);
    return response.data;
  },
  saveExercise: async (
    id: number,
    saveRequest: APIGainsTrackSaveExerciseTrainingSessionRequest,
  ) => {
    const response = await apiClient.post(
      `/sessions/${id}/exercises`,
      saveRequest,
    );
    return response.data;
  },
  deleteExerciseById: async (id: number, exerciseId: number) => {
    const response = await apiClient.delete(
      `/sessions/${id}/exercises/${exerciseId}`,
    );
    return response.data;
  },
  updateExercise: async (
    id: number,
    trainigSessionExerciseId: number,
    updateRequest: APIGainstrackUpdateExerciseTrainingSessionRequest,
  ) => {
    const response = await apiClient.patch(
      `/sessions/${id}/exercises/${trainigSessionExerciseId}`,
      updateRequest,
    );
    return response.data;
  },
  saveExerciseSet: async (
    id: number,
    trainigSessionExerciseId: number,
    saveRequest: APIGainstrackSaveTrainingSessionExerciseSet,
  ): Promise<APIGainstrackTrainingSessionDetailResponse> => {
    const response = await apiClient.post(
      `/sessions/${id}/exercises/${trainigSessionExerciseId}/sets`,
      saveRequest,
    );
    return response.data;
  },
  deleteSetById: async (
    id: number,
    trainigSessionExerciseId: number,
    setId: number,
  ): Promise<APIGainstrackTrainingSessionDetailResponse> => {
    const response = await apiClient.delete(
      `/sessions/${id}/exercises/${trainigSessionExerciseId}/sets/${setId}`,
    );
    return response.data;
  },
  updateExerciseSet: async (
    id: number,
    trainigSessionExerciseId: number,
    trainingSessionExerciseSet: TrainingSessionSet,
  ): Promise<APIGainstrackTrainingSessionDetailResponse> => {
    const response = await apiClient.patch(
      `/sessions/${id}/exercises/${trainigSessionExerciseId}/sets/${trainingSessionExerciseSet.id}`,
      trainingSessionExerciseSet,
    );
    return response.data;
  },
};
