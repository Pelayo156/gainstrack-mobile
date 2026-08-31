import { useMemo } from "react";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { ThemeColors } from "../../theme";

type GlassCardIntensity = "subtle" | "default" | "strong";

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: GlassCardIntensity;
};

const INTENSITY_STYLES: Record<GlassCardIntensity, ViewStyle> = {
  subtle: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  default: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  strong: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
};

function getStyles(t: ThemeColors) {
  return StyleSheet.create({
    base: {
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.surfaceBorder,
      borderRadius: 20,
      padding: 16,
      overflow: "hidden",
      shadowColor: "#000000",
    },
  });
}

export default function GlassCard({
  children,
  style,
  intensity = "default",
}: GlassCardProps) {
  const t = useAppTheme();
  const styles = useMemo(() => getStyles(t), [t]);

  return (
    <View style={[styles.base, INTENSITY_STYLES[intensity], style]}>
      {children}
    </View>
  );
}
