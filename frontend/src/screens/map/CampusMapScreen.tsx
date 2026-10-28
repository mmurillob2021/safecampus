import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { fetchMyIncidents } from "@/services/api/incidents.api";
import { useAppConfig } from "@/hooks/useAppConfig";
import { colors, spacing, typography } from "@/theme";
import type { Incident } from "@/types/incident";

// Used only until the map.center.* settings load from the API.
const FALLBACK_CENTER = { latitude: 4.6382, longitude: -74.084 };

export function CampusMapScreen() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const { config, safetyPoints, setting, numberSetting } = useAppConfig();

  useFocusEffect(
    useCallback(() => {
      fetchMyIncidents().then(setIncidents).catch(() => setIncidents([]));
    }, []),
  );

  const center = {
    latitude: numberSetting("map.center.latitude", FALLBACK_CENTER.latitude),
    longitude: numberSetting("map.center.longitude", FALLBACK_CENTER.longitude),
  };

  return (
    <ScreenContainer style={styles.container}>
      <MapView
        // Remount once the configured center arrives so initialRegion applies.
        key={config ? `${center.latitude},${center.longitude}` : "fallback"}
        style={styles.map}
        initialRegion={{ ...center, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      >
        {safetyPoints.map((point) => (
          <Marker
            key={point.id}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            title={point.title}
            description={point.description}
            pinColor={colors.accent}
          />
        ))}
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            coordinate={{ latitude: incident.latitude, longitude: incident.longitude }}
            title={incident.categoryRef?.label ?? incident.category}
            description={incident.status}
          />
        ))}
      </MapView>
      <View style={styles.legend}>
        <Text style={styles.legendText}>{setting("map.legend")}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 0 },
  map: { flex: 1 },
  legend: { padding: spacing.md, backgroundColor: colors.backgroundElevated },
  legendText: { ...typography.caption, color: colors.textOnDarkMuted },
});
