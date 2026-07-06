import { create } from "zustand";
import { APIGainsTrackExerciseResponse } from "../types/exercise.types";

interface ExercisePickerStore {
  pickedExercise: APIGainsTrackExerciseResponse | null;
  setPickedExercise: (exercise: APIGainsTrackExerciseResponse) => void;
  clearPickedExercise: () => void;
}

const useExercisePickerStore = create<ExercisePickerStore>((set) => ({
  pickedExercise: null,
  setPickedExercise: (exercise: APIGainsTrackExerciseResponse) =>
    set({ pickedExercise: exercise }),
  clearPickedExercise: () => set({ pickedExercise: null }),
}));

export default useExercisePickerStore;
