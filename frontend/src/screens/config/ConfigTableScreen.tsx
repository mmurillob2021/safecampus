import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "@/navigation/types";
import { ScreenContainer } from "@/components/ScreenContainer";
import { AlertBanner } from "@/components/AlertBanner";
import { Button } from "@/components/Button";
import { fetchConfigRows } from "@/services/api/config.api";
import { colors, radius, spacing, typography } from "@/theme";
import type { ConfigRow, ConfigTable } from "@/types/config";

type Props = NativeStackScreenProps<ProfileStackParamList, "ConfigTable">;

/** First text field that is not the id: the row's display title. */
function titleOf(table: ConfigTable, row: ConfigRow): string {
  const field = table.fields.find((f) => f.name !== table.idField && f.type !== "boolean");
  return String(row[field?.name ?? table.idField] ?? "");
}

function subtitleOf(table: ConfigTable, row: ConfigRow): string {
  if (!table.idGenerated) return String(row[table.idField]);
  const second = table.fields.filter((f) => f.type !== "boolean")[1];
  return second ? String(row[second.name] ?? "") : "";
}

/** Admin: rows of one parameter table. */
export function ConfigTableScreen({ route, navigation }: Props) {
  const { table } = route.params;
  const [rows, setRows] = useState<ConfigRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const hasActive = table.fields.some((f) => f.name === "active");

  useFocusEffect(
    useCallback(() => {
      fetchConfigRows(table.key)
        .then((data) => {
          setRows(data);
          setError(null);
        })
        .catch(() => setError("No se pudieron cargar los registros."));
    }, [table.key]),
  );

  return (
    <ScreenContainer>
      <Text style={styles.description}>{table.description}</Text>
      {error ? <AlertBanner message={error} /> : null}
      <FlatList
        data={rows}
        keyExtractor={(row) => String(row[table.idField])}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={() => navigation.navigate("ConfigRowForm", { table, row: item })}
          >
            <View style={styles.itemText}>
              <Text style={styles.title}>{titleOf(table, item)}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitleOf(table, item)}
              </Text>
            </View>
            {hasActive && item.active === false ? <Text style={styles.inactive}>Inactivo</Text> : null}
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.subtitle}>No hay registros.</Text>}
      />
      <Button label="Agregar registro" onPress={() => navigation.navigate("ConfigRowForm", { table })} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  description: { ...typography.caption, color: colors.textOnDarkMuted, marginBottom: spacing.md },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: { opacity: 0.7 },
  itemText: { flex: 1 },
  title: { ...typography.bodyStrong, color: colors.textOnDark },
  subtitle: { ...typography.caption, color: colors.textOnDarkMuted, marginTop: 2 },
  inactive: { ...typography.label, color: colors.warning },
});
