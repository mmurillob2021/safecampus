import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "@/navigation/types";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useAppConfig } from "@/hooks/useAppConfig";
import { colors, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<HomeStackParamList, "SafetyPoints">;

export function SafetyPointsScreen({ route, navigation }: Props) {
  const { query } = route.params;
  const term = query.trim().toLowerCase();
  const { safetyPoints, loading } = useAppConfig();
  const results = safetyPoints.filter((p) =>
    `${p.title} ${p.description}`.toLowerCase().includes(term),
  );

  return (
    <ScreenContainer>
      <Text style={styles.summary}>
        {loading ? "Cargando…" : `${results.length} resultado(s)${term ? ` para "${query}"` : ""}`}
      </Text>
      <FlatList
        data={results}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.title}
            {"\n"}
            <Text style={styles.itemDescription}>{item.description}</Text>
          </Text>
        )}
      />
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Volver</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summary: { ...typography.body, color: colors.textOnDarkMuted, marginBottom: spacing.md },
  item: { ...typography.body, color: colors.textOnDark, fontWeight: "700", paddingVertical: spacing.sm },
  itemDescription: { fontWeight: "400", color: colors.textOnDarkMuted },
  back: { alignItems: "center", paddingVertical: spacing.md },
  backText: { ...typography.body, color: colors.accent, fontWeight: "700" },
});
