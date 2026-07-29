import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

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

export default function GlassCard({
  children,
  style,
  intensity = "default",
}: GlassCardProps) {
  return (
    <View style={[styles.base, INTENSITY_STYLES[intensity], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 20,
    padding: 16,
    overflow: "hidden",
    shadowColor: "#000000",
  },
});
