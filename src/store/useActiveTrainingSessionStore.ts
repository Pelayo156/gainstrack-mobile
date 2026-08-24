import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { APIGainstrackTrainingSessionDetailResponse } from "../types/trainingSession.types";

interface ActiveTrainingSessionStore {
  originalTrainingSession: APIGainstrackTrainingSessionDetailResponse | null;
  activeTrainingSession: APIGainstrackTrainingSessionDetailResponse | null;
  startTimestamp: number | null;
  completedSetIds: Set<number>;
  setStartTimestamp: (timestamp: number) => void;
  setActiveTrainingSession: (
    trainingSession: APIGainstrackTrainingSessionDetailResponse,
  ) => void;
  restoreTrainingSession: (state: {
    originalTrainingSession: APIGainstrackTrainingSessionDetailResponse;
    activeTrainingSession: APIGainstrackTrainingSessionDetailResponse;
    completedSetIds: number[];
  }) => void;
  updateActiveTrainingSession: (
    updater: (
      prev: APIGainstrackTrainingSessionDetailResponse,
    ) => APIGainstrackTrainingSessionDetailResponse,
  ) => void;
  toggleCompletedSetId: (setId: number) => void;
  clearTrainingSession: () => void;
}

const useActiveTrainingSessionStore = create<ActiveTrainingSessionStore>(
  (set, get) => ({
    originalTrainingSession: null,
    activeTrainingSession: null,
    startTimestamp: null,
    completedSetIds: new Set(),
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
        "originalTrainingSession",
        JSON.stringify(trainingSession),
      );
      await AsyncStorage.setItem(
        "activeTrainingSession",
        JSON.stringify(trainingSession),
      );
      set({
        originalTrainingSession: trainingSession,
        activeTrainingSession: trainingSession,
      });
    },
    restoreTrainingSession: (state) => {
      set({
        originalTrainingSession: state.originalTrainingSession,
        activeTrainingSession: state.activeTrainingSession,
        completedSetIds: new Set(state.completedSetIds),
      });
    },
    updateActiveTrainingSession: (updater) => {
      const prev = get().activeTrainingSession;
      if (prev === null) return;
      const next = updater(prev);
      AsyncStorage.setItem("activeTrainingSession", JSON.stringify(next));
      set({ activeTrainingSession: next });
    },
    toggleCompletedSetId: (setId: number) => {
      const next = new Set(get().completedSetIds);
      if (next.has(setId)) next.delete(setId);
      else next.add(setId);
      AsyncStorage.setItem("completedSetIds", JSON.stringify([...next]));
      set({ completedSetIds: next });
    },
    clearTrainingSession: async () => {
      await AsyncStorage.removeItem("originalTrainingSession");
      await AsyncStorage.removeItem("activeTrainingSession");
      await AsyncStorage.removeItem("startTimestamp");
      await AsyncStorage.removeItem("completedSetIds");
      set({
        originalTrainingSession: null,
        activeTrainingSession: null,
        startTimestamp: null,
        completedSetIds: new Set(),
      });
    },
  }),
);

export default useActiveTrainingSessionStore;
