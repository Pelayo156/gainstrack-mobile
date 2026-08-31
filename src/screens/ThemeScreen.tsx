import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../hooks/useAppTheme";
import useThemeStore from "../store/useThemeStore";
import { ThemeColors } from "../theme";

function getStyles(t: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.background,
    },
    headerBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 56,
      paddingBottom: 16,
    },
    backButton: {
      padding: 4,
      width: 36,
    },
    headerTitle: {
      color: t.textPrimary,
      fontFamily: "Inter-Bold",
      fontSize: 20,
      letterSpacing: 0.5,
    },
    headerRight: {
      width: 36,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
      gap: 12,
    },
    optionCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: t.surface,
      borderWidth: 1,
      borderRadius: 18,
      paddingHorizontal: 20,
      paddingVertical: 18,
    },
    optionCardActive: {
      borderColor: t.primary,
      backgroundColor: t.primaryMuted,
    },
    optionCardInactive: {
      borderColor: t.surfaceBorder,
    },
    optionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    iconWrapActive: {
      backgroundColor: t.primary,
    },
    iconWrapInactive: {
      backgroundColor: t.surfaceElevated,
    },
    optionLabel: {
      fontFamily: "Inter-Bold",
      fontSize: 16,
      letterSpacing: 0.3,
    },
    optionLabelActive: {
      color: t.textPrimary,
    },
    optionLabelInactive: {
      color: t.textSecondary,
    },
    checkCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    checkCircleActive: {
      backgroundColor: t.primary,
    },
    checkCircleInactive: {
      backgroundColor: t.surfaceElevated,
      borderWidth: 1,
      borderColor: t.surfaceBorder,
    },
  });
}

export default function ThemeScreen({ navigation }: any) {
  const t = useAppTheme();
  const styles = useMemo(() => getStyles(t), [t]);
  const { mode, setMode } = useThemeStore();

  const options = [
    { value: "dark" as const, label: "Dark", icon: "moon" as const },
    { value: "light" as const, label: "Light", icon: "sunny" as const },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={t.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apariencia</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        {options.map((opt) => {
          const isActive = mode === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              activeOpacity={0.8}
              style={[
                styles.optionCard,
                isActive ? styles.optionCardActive : styles.optionCardInactive,
              ]}
              onPress={() => setMode(opt.value)}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.iconWrap,
                    isActive ? styles.iconWrapActive : styles.iconWrapInactive,
                  ]}
                >
                  <Ionicons
                    name={opt.icon}
                    size={20}
                    color={isActive ? t.primaryOnPrimary : t.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.optionLabel,
                    isActive
                      ? styles.optionLabelActive
                      : styles.optionLabelInactive,
                  ]}
                >
                  {opt.label}
                </Text>
              </View>
              <View
                style={[
                  styles.checkCircle,
                  isActive
                    ? styles.checkCircleActive
                    : styles.checkCircleInactive,
                ]}
              >
                {isActive && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={t.primaryOnPrimary}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
