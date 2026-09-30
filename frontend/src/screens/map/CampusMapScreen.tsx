import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ScreenContainer } from "@/components/ScreenContainer";
import { fetchMyIncidents } from "@/services/api/incidents.api";
import { colors, spacing, typography } from "@/theme";
import { SAFETY_POINTS } from "@/data/safetyPoints";
import type { Incident } from "@/types/incident";
import type { Coordinates } from "@/hooks/useLocation";

// Sample map centered on Bogotá.
const BOGOTA: Coordinates = { latitude: 4.6382, longitude: -74.0840 };

export function CampusMapScreen() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const region = BOGOTA;

  useEffect(() => {
    fetchMyIncidents().then(setIncidents).catch(() => setIncidents([]));
  }, []);

  return (
    <ScreenContainer style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {SAFETY_POINTS.map((point) => (
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
            title={incident.category.replace(/_/g, " ").toLowerCase()}
            description={incident.status}
          />
        ))}
      </MapView>
      <View style={styles.legend}>
        <Text style={styles.legendText}>Mapa de ejemplo de Bogotá: puntos de seguridad e incidentes reportados.</Text>
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
