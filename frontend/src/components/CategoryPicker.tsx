import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";
import type { IncidentCategory } from "@/types/incident";

const CATEGORIES: { value: IncidentCategory; label: string }[] = [
  { value: "THEFT", label: "Robo" },
  { value: "HARASSMENT", label: "Acoso" },
  { value: "SUSPICIOUS_ACTIVITY", label: "Actividad sospechosa" },
  { value: "VANDALISM", label: "Vandalismo" },
  { value: "OTHER", label: "Otro" },
];

interface CategoryPickerProps {
  value: IncidentCategory;
  onChange: (value: IncidentCategory) => void;
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <View style={styles.container}>
      {CATEGORIES.map((category) => {
        const selected = category.value === value;
        return (
          <Pressable
            key={category.value}
            onPress={() => onChange(category.value)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{category.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primaryButton, borderColor: colors.primaryButton },
  label: { ...typography.caption, color: colors.textOnLightMuted },
  labelSelected: { color: "#FFFFFF" },
});
