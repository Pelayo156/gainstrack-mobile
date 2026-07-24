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
    borderColor: "rgba(255,255,255,0.16)",
    borderTopColor: "rgba(255,255,255,0.28)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  default: {
    borderColor: "rgba(255,255,255,0.22)",
    borderTopColor: "rgba(255,255,255,0.38)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  strong: {
    borderColor: "rgba(255,255,255,0.28)",
    borderTopColor: "rgba(255,255,255,0.45)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
};

/** Caja con estilo glassmorphism reutilizable, tono morado de marca sobre fondo oscuro */
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
    backgroundColor: "rgba(104,26,219,0.06)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    overflow: "hidden",
    shadowColor: "#000000",
  },
});
