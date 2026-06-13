import { APIGainstrackRoutineSummaryResponse } from "../types/routine.types";
import apiClient from "./apiClient";

export const routineService = {
  findAll: async (): Promise<APIGainstrackRoutineSummaryResponse[]> => {
    const response = await apiClient.get("/routines");
    return response.data;
  },
};
