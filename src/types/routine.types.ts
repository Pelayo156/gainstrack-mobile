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

export interface APIGainstrackUpdateRoutineRequest {
  name: string | null;
  notes: string | null;
}

export interface APIGainsTrackRoutineDetailResponse {
  id: number;
  name: string;
  createdAt: Date;
  notes: string | null;
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
  weight: number | null;
  reps: number | null;
  notes: null | string;
}

export interface APIGainsTrackSaveExerciseRoutine {
  exerciseId: number;
  orderIndex: number;
}

export interface APIGainstrackSaveRoutineExerciseSet {
  setNumber: number;
  weight: number | null;
  reps: number | null;
  notes: null | string;
}
