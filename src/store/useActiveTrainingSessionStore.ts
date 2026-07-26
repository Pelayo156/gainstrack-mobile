import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { APIGainstrackTrainingSessionDetailResponse } from "../types/trainingSession.types";

interface ActiveTrainingSessionStore {
  activeTrainingSession: APIGainstrackTrainingSessionDetailResponse | null;
  startTimestamp: number | null;
  startTrainingSession: (
    trainingSession: APIGainstrackTrainingSessionDetailResponse,
    timestamp: number
  ) => void;
  clearTrainingSession: () => void;
}

const useActiveTrainingSessionStore = create<ActiveTrainingSessionStore>(
  (set) => ({
    activeTrainingSession: null,
    startTimestamp: null,
    startTrainingSession: async (
      trainingSession: APIGainstrackTrainingSessionDetailResponse,
      timestamp: number
    ) => {
      await AsyncStorage.setItem(
        "activeTrainingSession",
        JSON.stringify(trainingSession)
      );
      await AsyncStorage.setItem("startTimestamp", timestamp.toString());
      set({
        activeTrainingSession: trainingSession,
        startTimestamp: timestamp,
      });
    },
    clearTrainingSession: async () => {
      await AsyncStorage.removeItem("activeTrainingSession");
      await AsyncStorage.removeItem("startTimestamp");
      set({ activeTrainingSession: null, startTimestamp: null });
    },
  })
);

export default useActiveTrainingSessionStore;
