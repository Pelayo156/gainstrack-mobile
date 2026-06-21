import { APIGainsTrackMuscleGroupResponse } from "./muscleGroup.types";

export interface APIGainsTrackExerciseResponse {
  id: number;
  name: string;
  muscleGroup: APIGainsTrackMuscleGroupResponse;
  userId: number;
  isPredefined: boolean;
}
