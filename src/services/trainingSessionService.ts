import { APIGainstrackSaveTrainingSessionRequest } from "../types/trainingSession.types";
import apiClient from "./apiClient";

export const trainingSessionService = {
  save: async (saveRequest: APIGainstrackSaveTrainingSessionRequest) => {
    const response = await apiClient.post("/sessions", saveRequest);
    return response.data;
  },
  deleteById: async (sessionId: number) => {
    const response = await apiClient.delete(`/sessions/${sessionId}`);
    return response.data;
  },
};
