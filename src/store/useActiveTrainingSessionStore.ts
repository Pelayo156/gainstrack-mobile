import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { APIGainstrackTrainingSessionDetailResponse } from "../types/trainingSession.types";

interface ActiveTrainingSessionStore {
  activeTrainingSession: APIGainstrackTrainingSessionDetailResponse | null;
  startTimestamp: number | null;
  setStartTimestamp: (timestamp: number) => void;
  setActiveTrainingSession: (
    trainingSession: APIGainstrackTrainingSessionDetailResponse,
  ) => void;
  clearTrainingSession: () => void;
}

const useActiveTrainingSessionStore = create<ActiveTrainingSessionStore>(
  (set) => ({
    activeTrainingSession: null,
    startTimestamp: null,
    setStartTimestamp: async (timestamp: number) => {
      await AsyncStorage.setItem("startTimestamp", JSON.stringify(timestamp));
      set({
        startTimestamp: timestamp,
      });
    },
    setActiveTrainingSession: async (
      trainingSession: APIGainstrackTrainingSessionDetailResponse,
    ) => {
      await AsyncStorage.setItem(
        "activeTrainingSession",
        JSON.stringify(trainingSession),
      );
      set({
        activeTrainingSession: trainingSession,
      });
    },
    clearTrainingSession: async () => {
      await AsyncStorage.removeItem("activeTrainingSession");
      await AsyncStorage.removeItem("startTimestamp");
      set({ activeTrainingSession: null, startTimestamp: null });
    },
  }),
);

export default useActiveTrainingSessionStore;
