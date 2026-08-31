import { APIGainsTrackMuscleGroupResponse } from "../types/muscleGroup.types";
import apiClient from "./apiClient";

export const muscleGroupService = {
  findAll: async (): Promise<APIGainsTrackMuscleGroupResponse[]> => {
    const response = await apiClient.get("/muscle-groups");
    return response.data;
  },
};
