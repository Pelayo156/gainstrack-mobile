import { APIGainsTrackExerciseResponse } from "./exercise.types";
import { APIGainsTrackGymResponse } from "./gym.types";

export interface APIGainstrackTrainingSessionSummaryResponse {
  id: number;
  gym: APIGainsTrackGymResponse;
  sessionDate: Date;
  notes: string;
}

export interface APIGainstrackTrainingSessionDetailResponse {
  id: number;
  gym: APIGainsTrackGymResponse;
  sessionDate: Date;
  notes: string | null;
  exercises: TrainingSessionExercise[];
}

export interface TrainingSessionExercise {
  id: number;
  orderIndex: number;
  notes: string | null;
  exercise: APIGainsTrackExerciseResponse;
  sets: TrainingSessionSet[];
}

export interface TrainingSessionSet {
  id: number;
  setNumber: number;
  weight: number | null;
  reps: number | null;
  notes: string | null;
}

export interface APIGainstrackSaveTrainingSessionRequest {
  routineId: number;
  gymId: number | null;
}

export interface APIGainsTrackSaveExerciseTrainingSessionRequest {
  exerciseId: number;
  orderIndex: number;
}

export interface APIGainstrackUpdateExerciseTrainingSessionRequest {
  exerciseId: number;
  orderIndex: number;
  notes: string;
}

export interface APIGainstrackSaveTrainingSessionExerciseSet {
  setNumber: number;
  weight: number | null;
  reps: number | null;
  notes: null | string;
}

export interface APIGainstrackUpdateTrainingSessionRequest {
  notes: string | null;
}
