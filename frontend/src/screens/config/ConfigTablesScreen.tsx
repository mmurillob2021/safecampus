import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "@/navigation/types";
import { ScreenContainer } from "@/components/ScreenContainer";
import { AlertBanner } from "@/components/AlertBanner";
import { fetchConfigTables } from "@/services/api/config.api";
import { colors, radius, spacing, typography } from "@/theme";
import type { ConfigTable } from "@/types/config";

type Props = NativeStackScreenProps<ProfileStackParamList, "ConfigTables">;

/** Admin: list of parameter tables exposed by the backend config module. */
export function ConfigTablesScreen({ navigation }: Props) {
  const [tables, setTables] = useState<ConfigTable[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfigTables()
      .then(setTables)
      .catch(() => setError("No se pudieron cargar las tablas de configuración."));
  }, []);

  return (
    <ScreenContainer>
      {error ? <AlertBanner message={error} /> : null}
      <FlatList
        data={tables}
        keyExtractor={(t) => t.key}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={() => navigation.navigate("ConfigTable", { table: item })}
          >
            <Text style={styles.title}>{item.label}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: { opacity: 0.7 },
  title: { ...typography.bodyStrong, color: colors.accent },
  description: { ...typography.caption, color: colors.textOnDarkMuted, marginTop: spacing.xs },
});
