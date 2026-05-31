export interface APIGainstrackErrorResponse {
  status: number;
  error: string;
  message: string;
  errors: Errors | null;
  timestamp: Date;
}

export interface Errors {
  [key: string]: string;
}
