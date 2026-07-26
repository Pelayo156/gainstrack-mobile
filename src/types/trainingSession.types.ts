import { APIGainsTrackExerciseResponse } from "./exercise.types";
import { APIGainsTrackGymResponse } from "./gym.types";

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
