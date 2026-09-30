import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface AlertBannerProps {
  message: string;
  tone?: "danger" | "success" | "warning";
}

export function AlertBanner({ message, tone = "danger" }: AlertBannerProps) {
  const background = { danger: colors.dangerMuted, success: "#D1FADF", warning: "#FEF0C7" }[tone];
  const text = { danger: colors.danger, success: colors.success, warning: colors.warning }[tone];
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.text, { color: text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: radius.sm, padding: spacing.md, marginBottom: spacing.md },
  text: { ...typography.bodyStrong },
});
