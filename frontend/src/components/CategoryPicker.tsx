import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";
import { useAppConfig } from "@/hooks/useAppConfig";
import type { IncidentCategory } from "@/types/incident";

interface CategoryPickerProps {
  value: IncidentCategory;
  onChange: (value: IncidentCategory) => void;
}

/** Chips for the active incident categories (parameter table in the config module). */
export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  const { incidentCategories } = useAppConfig();
  return (
    <View style={styles.container}>
      {incidentCategories.map((category) => {
        const selected = category.code === value;
        return (
          <Pressable
            key={category.code}
            onPress={() => onChange(category.code)}
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
