export interface SafetyPoint {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

// Sample data: Bogotá (Universidad Nacional de Colombia campus area).
export const SAFETY_POINTS: SafetyPoint[] = [
  { id: "s1", title: "Punto de seguridad", description: "Portería principal", latitude: 4.6356, longitude: -74.0825 },
  { id: "s2", title: "Enfermería", description: "Atención médica 24h", latitude: 4.6401, longitude: -74.0852 },
  { id: "s3", title: "Zona de encuentro", description: "Plaza Che", latitude: 4.6385, longitude: -74.0871 },
  { id: "s4", title: "Cámara de vigilancia", description: "Calle 26 con Carrera 30", latitude: 4.6372, longitude: -74.0805 },
];
