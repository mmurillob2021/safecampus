import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "@/theme";

interface LogoProps {
  tagline?: string;
}

export function Logo({ tagline }: LogoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.badge} />
        <Text style={styles.title}>SafeCampus</Text>
      </View>
      {tagline ? <Text style={styles.tagline}>{tagline}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  title: { ...typography.h1, color: colors.textOnDark },
  tagline: { ...typography.caption, color: colors.accent, marginTop: 4 },
});
