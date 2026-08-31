import {
  APIGainsTrackGymRequest,
  APIGainsTrackGymResponse,
} from "../types/gym.types";
import apiClient from "./apiClient";

export const gymService = {
  findAll: async (): Promise<APIGainsTrackGymResponse[]> => {
    const response = await apiClient.get("/gyms");
    return response.data;
  },
  save: async (
    gym: APIGainsTrackGymRequest,
  ): Promise<APIGainsTrackGymResponse> => {
    const response = await apiClient.post("/gyms", gym);
    return response.data;
  },
  update: async (
    id: number,
    gym: APIGainsTrackGymRequest,
  ): Promise<APIGainsTrackGymResponse> => {
    const response = await apiClient.patch(`/gyms/${id}`, gym);
    return response.data;
  },
  deleteById: async (id: number): Promise<void> => {
    const response = await apiClient.delete(`/gyms/${id}`);
    return response.data;
  },
};
