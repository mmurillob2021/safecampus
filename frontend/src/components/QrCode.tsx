import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { create } from "qrcode/lib/core/qrcode";

interface QrCodeProps {
  value: string;
  /** Total side length in points, including the quiet zone. */
  size: number;
  color?: string;
  backgroundColor?: string;
}

/**
 * QR code drawn with plain Views (no native SVG dependency). Each row is
 * merged into horizontal runs so a version-3 code renders as a few hundred
 * views instead of one per module.
 */
export function QrCode({ value, size, color = "#FFFFFF", backgroundColor = "#14203D" }: QrCodeProps) {
  const runs = useMemo(() => {
    const { modules } = create(value, { errorCorrectionLevel: "M" });
    const result: { row: number; col: number; length: number }[] = [];
    for (let row = 0; row < modules.size; row++) {
      let start = -1;
      for (let col = 0; col <= modules.size; col++) {
        const dark = col < modules.size && modules.get(row, col);
        if (dark && start < 0) start = col;
        if (!dark && start >= 0) {
          result.push({ row, col: start, length: col - start });
          start = -1;
        }
      }
    }
    return { count: modules.size, result };
  }, [value]);

  const quietZone = 2; // modules of padding around the code
  const cell = size / (runs.count + quietZone * 2);

  return (
    <View
      style={[styles.container, { width: size, height: size, backgroundColor }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Código QR de acceso"
    >
      {runs.result.map(({ row, col, length }) => (
        <View
          key={`${row}-${col}`}
          style={{
            position: "absolute",
            top: (row + quietZone) * cell,
            left: (col + quietZone) * cell,
            width: length * cell + 0.5, // overlap hides hairline seams between runs
            height: cell + 0.5,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 14, overflow: "hidden" },
});
