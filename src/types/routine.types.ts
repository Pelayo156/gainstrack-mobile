import { APIGainsTrackExerciseResponse } from "./exercise.types";

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

export interface APIGainsTrackRoutineDetailResponse {
  id: number;
  name: string;
  createdAt: Date;
  notes: null;
  isFree: boolean;
  exercises: RoutineExercise[];
}

export interface RoutineExercise {
  id: number;
  orderIndex: number;
  notes: string;
  exercise: APIGainsTrackExerciseResponse;
  sets: Set[];
}

export interface Set {
  id: number;
  setNumber: number;
  weight: number;
  reps: number;
  notes: null | string;
}

export interface APIGainsTrackSaveExerciseRoutine {
  exerciseId: number;
  orderIndex: number;
}
