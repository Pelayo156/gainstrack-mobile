import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type ThemeMode = "dark" | "light";

interface ThemeStore {
  mode: ThemeMode;
  isLoading: boolean;
  init: () => Promise<void>;
  setMode: (mode: ThemeMode) => void;
}

const useThemeStore = create<ThemeStore>((set) => ({
  mode: "dark",
  isLoading: true,
  init: async () => {
    try {
      const saved = await AsyncStorage.getItem("theme");
      if (saved === "light" || saved === "dark") {
        set({ mode: saved });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  setMode: async (mode) => {
    await AsyncStorage.setItem("theme", mode);
    set({ mode });
  },
}));

export default useThemeStore;
