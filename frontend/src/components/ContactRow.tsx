import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface ContactRowProps {
  name: string;
  phone: string;
  onDelete?: () => void;
}

export function ContactRow({ name, phone, onDelete }: ContactRowProps) {
  return (
    <View style={styles.row}>
      <Pressable style={styles.info} onPress={() => Linking.openURL(`tel:${phone}`)}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.phone}>{phone}</Text>
      </Pressable>
      {onDelete ? (
        <Pressable onPress={onDelete} hitSlop={8}>
          <Text style={styles.delete}>Eliminar</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  info: { flex: 1 },
  name: { ...typography.bodyStrong, color: colors.textOnDark },
  phone: { ...typography.caption, color: colors.accent, marginTop: 2 },
  delete: { ...typography.caption, color: colors.danger },
});
