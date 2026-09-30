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
import { useAuth } from "@/hooks/useAuth";
import { colors, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      await register({ fullName, email, password });
    } catch {
      setError("No se pudo crear tu cuenta. Revisa tus datos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer style={styles.centered}>
      <Logo tagline="Únete a la red de seguridad de tu campus" />
      <Card style={styles.card}>
        <Text style={styles.heading}>Crear cuenta</Text>
        {error ? <AlertBanner message={error} /> : null}
        <TextField label="Nombre completo" value={fullName} onChangeText={setFullName} />
        <TextField
          label="Correo institucional"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextField label="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
        <Button label="Crear cuenta" onPress={handleSubmit} loading={loading} />
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          ¿Ya tienes cuenta? Inicia sesión
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
