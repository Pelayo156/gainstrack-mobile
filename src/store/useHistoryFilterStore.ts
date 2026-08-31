import { create } from "zustand";

interface HistoryFilterStore {
  selectedRoutineId: number | null;
  selectedGymId: number | null;
  setSelectedRoutineId: (id: number | null) => void;
  setSelectedGymId: (id: number | null) => void;
}

const useHistoryFilterStore = create<HistoryFilterStore>((set) => ({
  selectedRoutineId: null,
  selectedGymId: null,
  setSelectedRoutineId: (id) => set({ selectedRoutineId: id }),
  setSelectedGymId: (id) => set({ selectedGymId: id }),
}));

export default useHistoryFilterStore;
