import { APIGainsTrackGymResponse } from "../types/gym.types";
import apiClient from "./apiClient";

export const gymService = {
  findAll: async (): Promise<APIGainsTrackGymResponse[]> => {
    const response = await apiClient.get("/gyms");
    return response.data;
  },
};
