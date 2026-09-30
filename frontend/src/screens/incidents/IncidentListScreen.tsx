import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { IncidentsStackParamList } from "@/navigation/types";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Button } from "@/components/Button";
import { IncidentListItem } from "@/components/IncidentListItem";
import { fetchMyIncidents } from "@/services/api/incidents.api";
import { colors, spacing, typography } from "@/theme";
import type { Incident } from "@/types/incident";

type Props = NativeStackScreenProps<IncidentsStackParamList, "IncidentList">;

export function IncidentListScreen({ navigation }: Props) {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchMyIncidents().then(setIncidents).catch(() => setIncidents([]));
    }, []),
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Tus reportes</Text>
        <Button label="Reportar incidente" onPress={() => navigation.navigate("ReportIncident")} />
      </View>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <IncidentListItem incident={item} />}
        ListEmptyComponent={<Text style={styles.empty}>Aún no hay reportes.</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.md },
  title: { ...typography.h2, color: colors.textOnDark, marginBottom: spacing.sm },
  empty: { ...typography.body, color: colors.textOnDarkMuted, textAlign: "center", marginTop: spacing.xl },
});
