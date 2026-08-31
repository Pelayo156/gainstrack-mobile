import { DARK_THEME, LIGHT_THEME } from "../theme";
import useThemeStore from "../store/useThemeStore";

export function useAppTheme() {
  const { mode } = useThemeStore();
  return mode === "dark" ? DARK_THEME : LIGHT_THEME;
}
