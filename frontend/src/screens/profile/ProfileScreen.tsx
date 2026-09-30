import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Card } from "@/components/Card";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { updateMeRequest } from "@/services/api/users.api";
import { colors, spacing, typography } from "@/theme";

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const { logout } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateMeRequest({ fullName, phone });
      updateUser(updated);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Tu perfil</Text>
      <Card>
        <TextField label="Nombre completo" value={fullName} onChangeText={setFullName} />
        <TextField label="Teléfono" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <Text style={styles.email}>{user?.email}</Text>
        <Button label="Guardar cambios" onPress={handleSave} loading={saving} />
      </Card>
      <Button label="Cerrar sesión" onPress={logout} variant="danger" style={styles.logout} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textOnDark, marginBottom: spacing.md },
  email: { ...typography.caption, color: colors.textOnLightMuted, marginBottom: spacing.md },
  logout: { marginTop: spacing.lg },
});
