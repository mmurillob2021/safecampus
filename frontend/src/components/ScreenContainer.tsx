import { SafeAreaView, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { colors, spacing } from "@/theme";

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  dark?: boolean;
}

export function ScreenContainer({ children, style, dark = true }: ScreenContainerProps) {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: dark ? colors.background : "#F5F7FA" }, style]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
});
