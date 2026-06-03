export interface APIGainstrackLoginResponse {
  token: string;
}

export interface APIGainstrackRegisterResponse {
  token: string;
}

export interface APIGainstrackLoginRequest {
  email: string;
  password: string;
}

export interface APIGainstrackRegisterRequest {
  email: string;
  password: string;
}
