export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceBorder: string;
  primary: string;
  primaryDark: string;
  primaryMuted: string;
  primaryBorder: string;
  primaryOnPrimary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  divider: string;
  error: string;
  errorBg: string;
  errorBorder: string;
  errorText: string;
  statusBar: "light-content" | "dark-content";
}

export const DARK_THEME: ThemeColors = {
  background: "#121212",
  surface: "#1E1E1E",
  surfaceElevated: "#252525",
  surfaceBorder: "#2A2A2A",
  primary: "#AAFF00",
  primaryDark: "#88CC00",
  primaryMuted: "rgba(170,255,0,0.10)",
  primaryBorder: "rgba(170,255,0,0.35)",
  primaryOnPrimary: "#0D0D0D",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.55)",
  textTertiary: "rgba(255,255,255,0.30)",
  textDisabled: "rgba(255,255,255,0.20)",
  divider: "rgba(255,255,255,0.08)",
  error: "#FF453A",
  errorBg: "rgba(255,60,60,0.08)",
  errorBorder: "rgba(255,60,60,0.2)",
  errorText: "rgba(255,90,90,0.95)",
  statusBar: "light-content",
};

export const LIGHT_THEME: ThemeColors = {
  background: "#F4F4F4",
  surface: "#FFFFFF",
  surfaceElevated: "#F0F0F0",
  surfaceBorder: "#E0E0E0",
  primary: "#AAFF00",
  primaryDark: "#88CC00",
  primaryMuted: "rgba(170,255,0,0.18)",
  primaryBorder: "rgba(140,200,0,0.50)",
  primaryOnPrimary: "#0D0D0D",
  textPrimary: "#0D0D0D",
  textSecondary: "rgba(0,0,0,0.60)",
  textTertiary: "rgba(0,0,0,0.38)",
  textDisabled: "rgba(0,0,0,0.22)",
  divider: "rgba(0,0,0,0.08)",
  error: "#D93025",
  errorBg: "rgba(217,48,37,0.08)",
  errorBorder: "rgba(217,48,37,0.20)",
  errorText: "rgba(180,30,20,0.95)",
  statusBar: "dark-content",
};

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  pill: 50,
} as const;
