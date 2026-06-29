import { APIGainsTrackExerciseResponse } from "../types/exercise.types";
import apiClient from "./apiClient";

export const exerciseService = {
  findAll: async (): Promise<APIGainsTrackExerciseResponse[]> => {
    const response = await apiClient.get("/exercises");
    return response.data;
  },
};
