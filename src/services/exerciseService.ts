import {
  APIGainsTrackExerciseRequest,
  APIGainsTrackExerciseResponse,
} from "../types/exercise.types";
import apiClient from "./apiClient";

export const exerciseService = {
  findAll: async (): Promise<APIGainsTrackExerciseResponse[]> => {
    const response = await apiClient.get("/exercises");
    return response.data;
  },
  save: async (
    exercise: APIGainsTrackExerciseRequest,
  ): Promise<APIGainsTrackExerciseResponse> => {
    const response = await apiClient.post("/exercises", exercise);
    return response.data;
  },
  update: async (
    id: number,
    exercise: APIGainsTrackExerciseRequest,
  ): Promise<void> => {
    const response = await apiClient.put(`/exercises/${id}`, exercise);
    return response.data;
  },
  deleteById: async (id: number): Promise<void> => {
    const response = await apiClient.delete(`/exercises/${id}`);
    return response.data;
  },
};
