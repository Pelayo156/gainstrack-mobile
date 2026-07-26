import { APIGainstrackSaveTrainingSessionRequest } from "../types/trainingSession.types";
import apiClient from "./apiClient";

export const trainingSessionService = {
  save: async (saveRequest: APIGainstrackSaveTrainingSessionRequest) => {
    const response = await apiClient.post("/sessions", saveRequest);
    return response.data;
  },
};
