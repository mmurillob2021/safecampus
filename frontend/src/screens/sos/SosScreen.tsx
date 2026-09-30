import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SosButton } from "@/components/SosButton";
import { AlertBanner } from "@/components/AlertBanner";
import { useSos } from "@/hooks/useSos";
import { colors, spacing, typography } from "@/theme";

export function SosScreen() {
  const [silent, setSilent] = useState(false);
  const { trigger, cancel, countdown, callLog, error, busy, active } = useSos(silent);

  return (
    <ScreenContainer dark={false} style={styles.container}>
      <Text style={styles.title}>Alerta de emergencia</Text>
      <Text style={styles.description}>
        Toca el botón para iniciar. Tendrás 5 segundos para cancelar antes de que se envíe la alerta.
      </Text>
      {error ? <AlertBanner message={error} /> : null}

      <ScrollView contentContainerStyle={styles.center} showsVerticalScrollIndicator={false}>
        <SosButton
          onLongPress={trigger}
          active={active || busy}
          label={countdown !== null ? String(countdown) : undefined}
          hint={countdown !== null ? "Enviando alerta…" : "Mantén 3 s"}
        />
        {countdown !== null ? (
          <Pressable style={styles.cancel} onPress={cancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        ) : null}
        {callLog.map((line, i) => (
          <Text key={i} style={styles.callLine}>
            {line}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Modo silencioso</Text>
        <Switch value={silent} onValueChange={setSilent} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 0 },
  title: { ...typography.h1, color: colors.textOnLight, marginBottom: spacing.sm },
  description: { ...typography.body, fontSize: 17, color: colors.textOnLightMuted },
  center: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: spacing.lg },
  cancel: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.textOnLight,
  },
  cancelText: { ...typography.bodyStrong, color: colors.textOnLight },
  callLine: { ...typography.body, color: colors.textOnLight, marginTop: spacing.sm },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
  },
  footerLabel: { ...typography.bodyStrong, color: colors.textOnLight },
});
