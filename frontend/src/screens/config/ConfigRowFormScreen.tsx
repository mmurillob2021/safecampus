import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { isAxiosError } from "axios";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "@/navigation/types";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Card } from "@/components/Card";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { AlertBanner } from "@/components/AlertBanner";
import { createConfigRow, deleteConfigRow, updateConfigRow } from "@/services/api/config.api";
import { useConfigStore } from "@/store/configStore";
import { colors, spacing, typography } from "@/theme";
import type { ConfigField, ConfigRow } from "@/types/config";

type Props = NativeStackScreenProps<ProfileStackParamList, "ConfigRowForm">;

type FormValues = Record<string, string | boolean>;

function initialValues(fields: ConfigField[], row?: ConfigRow): FormValues {
  const values: FormValues = {};
  for (const f of fields) {
    const current = row?.[f.name];
    if (f.type === "boolean") values[f.name] = current === undefined || current === null ? true : Boolean(current);
    else values[f.name] = current === undefined || current === null ? "" : String(current);
  }
  return values;
}

function errorMessage(err: unknown): string {
  if (isAxiosError(err) && typeof err.response?.data?.message === "string") return err.response.data.message;
  return "No se pudo guardar el registro.";
}

/** Admin: generic create/edit form built from the table's field metadata. */
export function ConfigRowFormScreen({ route, navigation }: Props) {
  const { table, row } = route.params;
  const isEdit = !!row;
  const rowId = row ? String(row[table.idField]) : undefined;
  const fields = table.fields.filter((f) => !(isEdit && f.name === table.idField));
  const [values, setValues] = useState<FormValues>(() => initialValues(fields, row));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reloadConfig = useConfigStore((s) => s.load);

  function setValue(name: string, value: string | boolean) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function buildPayload(): ConfigRow {
    const payload: ConfigRow = {};
    for (const f of fields) {
      const value = values[f.name];
      if (f.type === "boolean") {
        payload[f.name] = Boolean(value);
        continue;
      }
      const text = String(value).trim();
      if (text === "") {
        // Optional numbers keep their DB default; optional texts are cleared.
        if (!f.required && f.type !== "number") payload[f.name] = null;
        continue;
      }
      payload[f.name] = f.type === "number" ? Number(text.replace(",", ".")) : text;
    }
    return payload;
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const payload = buildPayload();
      if (isEdit) await updateConfigRow(table.key, rowId!, payload);
      else await createConfigRow(table.key, payload);
      await reloadConfig();
      navigation.goBack();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    Alert.alert("Eliminar registro", "Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteConfigRow(table.key, rowId!);
            await reloadConfig();
            navigation.goBack();
          } catch (err) {
            setError(errorMessage(err));
          }
        },
      },
    ]);
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {error ? <AlertBanner message={error} /> : null}
        <Card>
          {isEdit && !table.idGenerated ? (
            <Text style={styles.idText}>
              {table.fields.find((f) => f.name === table.idField)?.label}: {rowId}
            </Text>
          ) : null}
          {fields.map((f) =>
            f.type === "boolean" ? (
              <View key={f.name} style={styles.switchRow}>
                <Text style={styles.switchLabel}>{f.label}</Text>
                <Switch value={Boolean(values[f.name])} onValueChange={(v) => setValue(f.name, v)} />
              </View>
            ) : (
              <View key={f.name}>
                <TextField
                  label={`${f.label}${f.required ? " *" : ""}`}
                  value={String(values[f.name])}
                  onChangeText={(v) => setValue(f.name, v)}
                  autoCapitalize={f.name === table.idField || f.type === "color" ? "none" : "sentences"}
                  keyboardType={f.type === "number" ? "numbers-and-punctuation" : "default"}
                  multiline={f.type === "text"}
                />
                {f.help ? <Text style={styles.help}>{f.help}</Text> : null}
              </View>
            ),
          )}
          <Button label="Guardar" onPress={handleSave} loading={saving} />
        </Card>
        {isEdit ? <Button label="Eliminar" onPress={handleDelete} variant="danger" style={styles.delete} /> : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  idText: { ...typography.label, color: colors.textOnLightMuted, marginBottom: spacing.md },
  help: { ...typography.caption, color: colors.textOnLightMuted, marginTop: -spacing.sm, marginBottom: spacing.md },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  switchLabel: { ...typography.bodyStrong, color: colors.textOnLight },
  delete: { marginTop: spacing.lg },
});
