import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { IncidentsStackParamList } from "@/navigation/types";
import { ScreenContainer } from "@/components/ScreenContainer";
import { AlertBanner } from "@/components/AlertBanner";
import { useLocation } from "@/hooks/useLocation";
import { createIncidentRequest } from "@/services/api/incidents.api";
import { colors, radius, spacing, typography } from "@/theme";
import type { IncidentCategory } from "@/types/incident";

type Props = NativeStackScreenProps<IncidentsStackParamList, "ReportIncident">;

// The API only knows a few categories; the richer UI options map onto them.
const CATEGORIES: { label: string; api: IncidentCategory }[] = [
  { label: "Acoso", api: "HARASSMENT" },
  { label: "Hurto", api: "THEFT" },
  { label: "Accidente", api: "OTHER" },
  { label: "Emergencia médica", api: "OTHER" },
  { label: "Incendio", api: "OTHER" },
  { label: "Infraestructura", api: "VANDALISM" },
  { label: "Sustancias", api: "SUSPICIOUS_ACTIVITY" },
  { label: "Otro", api: "OTHER" },
];

const SEVERITIES = ["Baja", "Media", "Alta", "Crítica"];

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

export function ReportIncidentScreen({ navigation }: Props) {
  const { getCurrentCoordinates } = useLocation();
  const [category, setCategory] = useState<string | null>(null);
  const [severity, setSeverity] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const canSubmit = !!category && !!severity && !loading;

  async function handlePickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
    if (!result.canceled) setPhotoUrl(result.assets[0].uri);
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setStatus("idle");
    try {
      const coords = await getCurrentCoordinates();
      const api = CATEGORIES.find((c) => c.label === category)!.api;
      const tags = `[${category} · ${severity}${anonymous ? " · Anónimo" : ""}]`;
      await createIncidentRequest({
        category: api,
        description: `${tags} ${description}`.trim(),
        photoUrl,
        ...coords,
      });
      setStatus("sent");
      setCategory(null);
      setSeverity(null);
      setDescription("");
      setAnonymous(false);
      setPhotoUrl(undefined);
      setTimeout(() => navigation.navigate("IncidentList"), 800);
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer dark={false}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Reportar incidente</Text>
        {status === "sent" && <AlertBanner tone="success" message="Reporte enviado." />}
        {status === "error" && <AlertBanner message="No se pudo enviar tu reporte." />}

        <Text style={styles.sectionLabel}>CATEGORÍA</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((c) => (
            <Chip key={c.label} label={c.label} selected={category === c.label} onPress={() => setCategory(c.label)} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>SEVERIDAD</Text>
        <View style={styles.chips}>
          {SEVERITIES.map((s) => (
            <Chip key={s} label={s} selected={severity === s} onPress={() => setSeverity(s)} />
          ))}
        </View>

        <Text style={styles.fieldLabel}>Descripción</Text>
        <TextInput
          style={styles.textArea}
          multiline
          placeholder="Describe lo que ocurrió con el mayor detalle posible..."
          placeholderTextColor="#98A2B3"
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Reporte anónimo</Text>
          <Switch value={anonymous} onValueChange={setAnonymous} />
        </View>

        <Pressable style={styles.evidence} onPress={handlePickPhoto}>
          <Ionicons name="camera-outline" size={20} color={colors.textOnLight} />
          <Text style={styles.evidenceLabel}>{photoUrl ? "Evidencia adjunta" : "Adjuntar evidencia"}</Text>
        </Pressable>

        <Pressable
          style={[styles.submit, canSubmit && styles.submitEnabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitLabel}>{loading ? "Enviando…" : "Enviar reporte"}</Text>
        </Pressable>
        {!canSubmit && !loading ? (
          <Text style={styles.hint}>Selecciona una categoría y severidad para continuar</Text>
        ) : null}

        <Pressable onPress={() => navigation.navigate("IncidentList")} style={styles.listLink}>
          <Text style={styles.listLinkText}>Ver mis reportes</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.textOnLight, marginBottom: spacing.lg },
  sectionLabel: { ...typography.label, color: colors.textOnLightMuted, letterSpacing: 0.8, marginBottom: spacing.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primaryButton, borderColor: colors.primaryButton },
  chipLabel: { ...typography.caption, fontWeight: "600", color: colors.textOnLight },
  chipLabelSelected: { color: "#FFFFFF" },
  fieldLabel: { ...typography.label, color: colors.textOnLightMuted, marginBottom: spacing.sm },
  textArea: {
    height: 120,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 15,
    color: colors.textOnLight,
    marginBottom: spacing.lg,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  switchLabel: { ...typography.body, color: colors.textOnLight },
  evidence: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.textOnLight,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: spacing.md,
  },
  evidenceLabel: { ...typography.bodyStrong, color: colors.textOnLight },
  submit: { backgroundColor: "#98A2B3", borderRadius: 12, paddingVertical: 16, alignItems: "center" },
  submitEnabled: { backgroundColor: colors.primaryButton },
  submitLabel: { ...typography.h3, color: "#FFFFFF" },
  hint: { ...typography.caption, color: colors.textOnLightMuted, textAlign: "center", marginTop: spacing.sm },
  listLink: { alignItems: "center", paddingVertical: spacing.lg },
  listLinkText: { ...typography.bodyStrong, color: colors.link },
});
