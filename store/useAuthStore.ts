import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface AuthStore {
  token: string | null;
  email: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  email: null,
  login: async (token: string, email: string) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("email", email);
    set({ token: token, email: email });
  },
  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("email");
    set({ token: null, email: null });
  },
  isLoading: true,
  setIsLoading: (value: boolean) => set({ isLoading: value }),
}));

export default useAuthStore;
