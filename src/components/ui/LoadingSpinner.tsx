import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoadingSpinner() {
  return (
    <View style={styles.containerContentCenter}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  containerContentCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
