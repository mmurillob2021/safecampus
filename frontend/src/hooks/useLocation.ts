import { useCallback } from "react";
import * as Location from "expo-location";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const getCurrentCoordinates = useCallback(async (): Promise<Coordinates> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Se requiere permiso de ubicación para enviar una alerta");
    }
    const position = await Location.getCurrentPositionAsync({});
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  }, []);

  return { getCurrentCoordinates };
}
