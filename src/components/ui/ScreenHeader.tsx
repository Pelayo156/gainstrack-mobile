import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { ThemeColors } from "../../theme";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
};

function getStyles(t: ThemeColors) {
  return StyleSheet.create({
    container: {
      alignItems: "center",
    },
    title: {
      color: t.textPrimary,
      fontFamily: "Inter-Bold",
      fontSize: 38,
      letterSpacing: 1.5,
    },
    subtitle: {
      color: t.textTertiary,
      fontSize: 11,
      letterSpacing: 3,
      marginTop: 8,
    },
  });
}

export default function ScreenHeader({ title, subtitle, style }: ScreenHeaderProps) {
  const t = useAppTheme();
  const styles = useMemo(() => getStyles(t), [t]);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle !== undefined && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
}
