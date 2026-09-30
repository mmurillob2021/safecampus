import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "@/theme";

interface SosButtonProps {
  onPress?: () => void;
  /** Fires after holding the button for 3 seconds. */
  onLongPress?: () => void;
  active?: boolean;
  label?: string;
  hint?: string;
}

export function SosButton({ onPress, onLongPress, active, label, hint }: SosButtonProps) {
  return (
    <View style={styles.glow}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={3000}
        style={({ pressed }) => [styles.button, { opacity: active || pressed ? 0.85 : 1 }]}
      >
        <Text style={styles.label}>{label ?? (active ? "SOS ENVIADO" : "SOS")}</Text>
        <Text style={styles.hint}>{hint ?? (active ? "La ayuda va en camino" : "Mantén 3 s")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 5,
    borderColor: "#F1DDA6",
    backgroundColor: "#F1DDA6",
    alignSelf: "center",
    shadowColor: colors.danger,
    shadowOpacity: 0.45,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  button: {
    flex: 1,
    borderRadius: 95,
    backgroundColor: "#A83220",
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 46, fontWeight: "800", color: "#FFFFFF" },
  hint: { ...typography.caption, fontSize: 12, color: "#FFFFFF", marginTop: 2 },
});
