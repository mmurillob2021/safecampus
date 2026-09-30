import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "danger" | "secondary";
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, loading, variant = "primary", style }: ButtonProps) {
  const backgroundColor = {
    primary: colors.primaryButton,
    danger: colors.danger,
    secondary: colors.backgroundElevated,
  }[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={[styles.base, { backgroundColor, opacity: loading ? 0.7 : 1 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primaryButtonText} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  label: { ...typography.bodyStrong, color: colors.primaryButtonText },
});
