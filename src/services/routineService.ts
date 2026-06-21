import {
  APIGainsTrackRoutineDetailResponse,
  APIGainstrackRoutineSummaryResponse,
  APIGainstrackSaveRoutineRequest,
} from "../types/routine.types";
import apiClient from "./apiClient";

export const routineService = {
  findAll: async (): Promise<APIGainstrackRoutineSummaryResponse[]> => {
    const response = await apiClient.get("/routines");
    return response.data;
  },
  save: async (
    saveRequest: APIGainstrackSaveRoutineRequest,
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
};
