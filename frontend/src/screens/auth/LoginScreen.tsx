import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer style={styles.centered}>
      <Logo tagline="Tu compañero de seguridad en el campus" />
      <Card style={styles.card}>
        <Text style={styles.heading}>Iniciar sesión</Text>
        {error ? <AlertBanner message={error} /> : null}
        <TextField
          label="Correo institucional"
          placeholder="tu@universidad.edu.co"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button label="Iniciar sesión" onPress={handleSubmit} loading={loading} />
        <View style={styles.footerRow}>
          <Text style={styles.link} onPress={() => navigation.navigate("ForgotPassword")}>
            ¿Olvidaste tu contraseña?
          </Text>
          <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
            Crear cuenta
          </Text>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { justifyContent: "center", gap: spacing.lg },
  card: { marginTop: spacing.lg },
  heading: { ...typography.h2, color: colors.textOnLight, marginBottom: spacing.md },
  footerRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md },
  link: { ...typography.caption, color: colors.link },
});
