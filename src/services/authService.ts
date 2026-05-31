import {
  APIGainstrackLoginRequest,
  APIGainstrackLoginResponse,
} from "../types/auth.types";
import apiClient from "./apiClient";

export const authService = {
  login: async (
    loginRequest: APIGainstrackLoginRequest,
  ): Promise<APIGainstrackLoginResponse> => {
    const response = await apiClient.post("/auth/login", loginRequest);
    return response.data;
  },
};
