export interface APIGainstrackRoutineSummaryResponse {
  id: number;
  name: string;
  createdAt: Date;
  notes: null | string;
  isFree: boolean;
}

export interface APIGainstrackSaveRoutineRequest {
  name: string;
  notes: string;
}
