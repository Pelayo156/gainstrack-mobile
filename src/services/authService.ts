import {
  APIGainstrackLoginRequest,
  APIGainstrackLoginResponse,
  APIGainstrackRegisterRequest,
  APIGainstrackRegisterResponse,
} from "../types/auth.types";
import apiClient from "./apiClient";

export const authService = {
  login: async (
    loginRequest: APIGainstrackLoginRequest,
  ): Promise<APIGainstrackLoginResponse> => {
    const response = await apiClient.post("/auth/login", loginRequest);
    return response.data;
  },
  register: async (
    registerRequest: APIGainstrackRegisterRequest,
  ): Promise<APIGainstrackRegisterResponse> => {
    const response = await apiClient.post("/auth/register", registerRequest);
    return response.data;
  },
};
