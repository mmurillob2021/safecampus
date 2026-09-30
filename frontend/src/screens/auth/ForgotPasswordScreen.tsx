import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/navigation/types";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/Card";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { AlertBanner } from "@/components/AlertBanner";
import { forgotPasswordRequest } from "@/services/api/auth.api";
import { colors, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await forgotPasswordRequest(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer style={styles.centered}>
      <Logo tagline="Restablece tu contraseña" />
      <Card style={styles.card}>
        <Text style={styles.heading}>Olvidé mi contraseña</Text>
        {sent ? (
          <AlertBanner tone="success" message="Si el correo está registrado, revisa tu bandeja de entrada." />
        ) : (
          <TextField
            label="Correo institucional"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        )}
        <Button label="Enviar instrucciones" onPress={handleSubmit} loading={loading} />
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Volver a iniciar sesión
        </Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { justifyContent: "center", gap: spacing.lg },
  card: { marginTop: spacing.lg },
  heading: { ...typography.h2, color: colors.textOnLight, marginBottom: spacing.md },
  link: { ...typography.caption, color: colors.link, marginTop: spacing.md, textAlign: "center" },
});
