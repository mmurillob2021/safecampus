import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";
import type { Incident } from "@/types/incident";

const STATUS_LABEL: Record<Incident["status"], string> = {
  PENDING: "Pendiente",
  REVIEWED: "Revisado",
  RESOLVED: "Resuelto",
};

interface IncidentListItemProps {
  incident: Incident;
}

export function IncidentListItem({ incident }: IncidentListItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.category}>{incident.categoryRef?.label ?? incident.category}</Text>
        <Text style={styles.status}>{STATUS_LABEL[incident.status]}</Text>
      </View>
      <View style={styles.meta}>
        {incident.severityRef ? (
          <Text style={[styles.severity, { color: incident.severityRef.color }]}>
            Severidad {incident.severityRef.label.toLowerCase()}
          </Text>
        ) : null}
        {incident.anonymous ? <Text style={styles.status}>Anónimo</Text> : null}
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {incident.description}
      </Text>
      <Text style={styles.date}>{new Date(incident.createdAt).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs },
  category: { ...typography.bodyStrong, color: colors.accent, textTransform: "capitalize" },
  status: { ...typography.caption, color: colors.textOnDarkMuted },
  meta: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.xs },
  severity: { ...typography.label },
  description: { ...typography.body, color: colors.textOnDark },
  date: { ...typography.caption, color: colors.textOnDarkMuted, marginTop: spacing.xs },
});
