import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { AlertBanner } from "@/components/AlertBanner";
import { QrCode } from "@/components/QrCode";
import { createAccessPassRequest, fetchActiveAccessPass } from "@/services/api/access.api";
import { colors, spacing, typography } from "@/theme";
import type { AccessPass } from "@/types/access";

const NAVY = "#14203D";
const VALID_GREEN = "#2F855A";
const QR_SIZE = 190;

/** Local deadline: device clock + time left according to the server clock. */
function localDeadline(pass: AccessPass): number {
  const remaining = new Date(pass.expiresAt).getTime() - new Date(pass.serverTime).getTime();
  return Date.now() + remaining;
}

function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export function AccessPassScreen() {
  const [pass, setPass] = useState<AccessPass | null>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showPass = useCallback((next: AccessPass | null) => {
    setPass(next);
    const end = next ? localDeadline(next) : null;
    setDeadline(end);
    setRemaining(end ? end - Date.now() : 0);
  }, []);

  // Restore a still-valid pass when the user comes back to the tab.
  useFocusEffect(
    useCallback(() => {
      fetchActiveAccessPass()
        .then(showPass)
        .catch(() => undefined);
    }, [showPass]),
  );

  // Countdown; the pass disappears when it expires.
  useEffect(() => {
    if (!deadline) return;
    const tick = () => {
      const left = deadline - Date.now();
      if (left <= 0) showPass(null);
      else setRemaining(left);
    };
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [deadline, showPass]);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      showPass(await createAccessPassRequest());
    } catch {
      setError("No se pudo generar el pase. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer dark={false} style={styles.container}>
      <Text style={styles.title}>Pase de acceso</Text>
      {error ? <AlertBanner message={error} /> : null}

      {pass ? (
        <View style={[styles.card, styles.cardActive]}>
          <Text style={styles.zoneName}>{pass.zoneName}</Text>
          {pass.zoneDetail ? <Text style={styles.zoneDetail}>{pass.zoneDetail}</Text> : null}
          <View style={styles.qr}>
            <QrCode value={pass.qrValue} size={QR_SIZE} backgroundColor={NAVY} />
          </View>
          <View style={styles.validRow}>
            <Ionicons name="time-outline" size={16} color={VALID_GREEN} />
            <Text style={styles.validText}>Vigente · {formatRemaining(remaining)}</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.card, styles.cardEmpty]}>
          <Ionicons name="qr-code-outline" size={44} color={colors.textOnLightMuted} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Sin pase activo</Text>
          <Text style={styles.emptyBody}>Genera un pase para acceder a zonas restringidas del campus.</Text>
          <Pressable
            testID="access-generate-button"
            accessibilityRole="button"
            onPress={handleGenerate}
            disabled={loading}
            style={({ pressed }) => [styles.button, (pressed || loading) && styles.buttonPressed]}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonLabel}>Generar pase</Text>}
          </Pressable>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.md },
  title: { ...typography.h2, fontSize: 24, color: colors.textOnLight, marginTop: spacing.sm, marginBottom: spacing.lg },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#101828",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardActive: { alignItems: "center", paddingVertical: spacing.lg, paddingHorizontal: spacing.md },
  zoneName: { ...typography.h3, fontWeight: "700", color: colors.textOnLight, textAlign: "center" },
  zoneDetail: { ...typography.caption, color: colors.textOnLightMuted, marginTop: spacing.xs, textAlign: "center" },
  qr: { marginTop: spacing.md, marginBottom: spacing.md },
  validRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  validText: { ...typography.label, fontSize: 14, fontWeight: "700", color: VALID_GREEN },
  cardEmpty: { alignItems: "center", paddingVertical: spacing.lg, paddingHorizontal: spacing.lg },
  emptyIcon: { alignSelf: "flex-start", marginLeft: spacing.sm, marginBottom: spacing.md },
  emptyTitle: { ...typography.h3, fontSize: 17, fontWeight: "700", color: colors.textOnLight },
  emptyBody: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textOnLightMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md + 4,
  },
  button: {
    alignSelf: "stretch",
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: { opacity: 0.8 },
  buttonLabel: { ...typography.bodyStrong, color: "#FFFFFF" },
});
