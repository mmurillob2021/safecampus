import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "@/navigation/types";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";

type Severity = "ALTA" | "MEDIA" | "BAJA";

// Sample institutional alerts.
const ALERTS: { id: string; title: string; body: string; place: string; ago: string; severity: Severity }[] = [
  {
    id: "a1",
    title: "Restricción de acceso",
    body: "El bloque D permanecerá cerrado hoy entre las 2:00 pm y las 6:00 pm por trabajos de mantenimiento.",
    place: "Bloque D · Parqueadero norte",
    ago: "Hace 15 min",
    severity: "ALTA",
  },
  {
    id: "a2",
    title: "Alerta climática",
    body: "Se esperan lluvias fuertes a partir de las 3:00 pm. Evita zonas descubiertas en el campus.",
    place: "Campus general",
    ago: "Hace 42 min",
    severity: "MEDIA",
  },
  {
    id: "a3",
    title: "Actualización de protocolo",
    body: "El protocolo de evacuación fue actualizado. Revisa los nuevos puntos de encuentro en el mapa.",
    place: "Todos los bloques",
    ago: "Hace 2 h",
    severity: "BAJA",
  },
];

const SEVERITY_COLOR: Record<Severity, string> = { ALTA: "#A83220", MEDIA: "#2F55C7", BAJA: "#3B8F5C" };

type Props = NativeStackScreenProps<HomeStackParamList, "HomeMain">;

export function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState("");
  const [showEmpty, setShowEmpty] = useState(false);
  const user = useAuthStore((s) => s.user);
  const fullName = user?.fullName ?? "";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <ScreenContainer dark={false} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Hola, {fullName}</Text>
            <Text style={styles.campus}>Campus Norte · Ingeniería de Sistemas</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || "SC"}</Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>ESTADO DEL CAMPUS</Text>
          <Text style={styles.statusTitle}>Operación normal</Text>
          <Text style={styles.statusSub}>Última verificación hace 3 min</Text>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Buscar puntos de seguridad…"
          placeholderTextColor="#98A2B3"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => navigation.navigate("SafetyPoints", { query })}
        />

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
            onPress={() => navigation.navigate("SafetyPoints", { query })}
          >
            <Ionicons name="location-outline" size={24} color={colors.textOnLight} />
            <Text style={styles.actionTitle}>Acompañamiento</Text>
            <Text style={styles.actionSub}>Iniciar recorrido</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
            <Ionicons name="qr-code-outline" size={24} color={colors.textOnLight} />
            <Text style={styles.actionTitle}>Pase de acceso</Text>
            <Text style={styles.actionSub}>Generar código QR</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Alertas institucionales</Text>
          <Pressable onPress={() => setShowEmpty((v) => !v)}>
            <Text style={styles.sectionLink}>{showEmpty ? "Ver alertas" : "Estado vacío"}</Text>
          </Pressable>
        </View>

        {showEmpty ? (
          <Text style={styles.empty}>No hay alertas institucionales por ahora.</Text>
        ) : (
          ALERTS.map((a) => (
            <View key={a.id} style={styles.alertCard}>
              <View style={styles.alertTop}>
                <Text style={styles.alertTitle}>{a.title}</Text>
                <View style={[styles.badge, { backgroundColor: SEVERITY_COLOR[a.severity] }]}>
                  <Text style={styles.badgeText}>{a.severity}</Text>
                </View>
              </View>
              <Text style={styles.alertBody} numberOfLines={2}>
                {a.body}
              </Text>
              <View style={styles.alertMeta}>
                <Text style={styles.metaText}>{a.place}</Text>
                <Text style={styles.metaText}>{a.ago}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const card = {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: colors.border,
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.md, paddingBottom: 0 },
  content: { paddingBottom: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  headerText: { flex: 1 },
  greeting: { ...typography.h2, color: colors.textOnLight },
  campus: { ...typography.caption, color: colors.textOnLightMuted, marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#111E36",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { ...typography.bodyStrong, color: colors.accent },
  statusCard: { backgroundColor: "#111E36", borderRadius: 16, padding: spacing.md, marginBottom: spacing.md },
  statusLabel: { ...typography.label, color: colors.accent, letterSpacing: 0.8 },
  statusTitle: { ...typography.h1, color: "#FFFFFF", marginVertical: 4 },
  statusSub: { ...typography.caption, color: colors.accent },
  search: {
    ...card,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textOnLight,
    marginBottom: spacing.md,
  },
  actions: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg },
  actionCard: { ...card, flex: 1, padding: spacing.md },
  pressed: { opacity: 0.7 },
  actionTitle: { ...typography.bodyStrong, color: colors.textOnLight, marginTop: spacing.md },
  actionSub: { ...typography.caption, color: colors.textOnLightMuted, marginTop: 2 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.textOnLight },
  sectionLink: { ...typography.caption, color: colors.textOnLight },
  empty: { ...typography.body, color: colors.textOnLightMuted, textAlign: "center", marginTop: spacing.lg },
  alertCard: { ...card, padding: spacing.md, marginBottom: spacing.md },
  alertTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  alertTitle: { ...typography.h3, color: colors.textOnLight, flex: 1, marginRight: spacing.sm },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },
  alertBody: { ...typography.body, fontSize: 17, lineHeight: 26, color: colors.textOnLight, marginVertical: spacing.sm },
  alertMeta: { flexDirection: "row", justifyContent: "space-between" },
  metaText: { ...typography.caption, color: colors.textOnLightMuted },
});
