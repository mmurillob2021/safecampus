import { useEffect, useRef, useState } from "react";
import { Vibration } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useSosStore } from "@/store/sosStore";
import { useLocation } from "@/hooks/useLocation";
import { createAlertRequest } from "@/services/api/alerts.api";
import { fetchPersonalContacts } from "@/services/api/contacts.api";
import { getSocket } from "@/services/socket";
import type { EmergencyAlert } from "@/types/alert";

export const CANCEL_SECONDS = 5;

const DEMO_CONTACTS = [
  { id: "d1", name: "Mamá", phone: "300 123 4567" },
  { id: "d2", name: "Papá", phone: "310 765 4321" },
  { id: "d3", name: "Seguridad Campus", phone: "601 555 0100" },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** SOS flow: cancellable countdown, then send the alert and simulate calling contacts. */
export function useSos(silent: boolean) {
  const user = useAuthStore((s) => s.user);
  const activeAlert = useSosStore((s) => s.activeAlert);
  const setActiveAlert = useSosStore((s) => s.setActiveAlert);
  const { getCurrentCoordinates } = useLocation();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [callLog, setCallLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    const socket = getSocket();
    const onResolved = (alert: EmergencyAlert) => {
      if (alert.userId === user?.id) setActiveAlert(null);
    };
    socket?.on("sos:resolved", onResolved);
    return () => {
      socket?.off("sos:resolved", onResolved);
    };
  }, [user?.id, setActiveAlert]);

  async function simulateCalls() {
    const saved = await fetchPersonalContacts().catch(() => []);
    // Demo fallback so the simulation always runs, even with no saved contacts.
    const contacts = saved.length > 0 ? saved : DEMO_CONTACTS;
    for (const c of contacts) {
      setCallLog((log) => [...log, `📞 Llamando a ${c.name} (${c.phone})…`]);
      await wait(2000);
      setCallLog((log) => [...log.slice(0, -1), `✅ Llamada simulada a ${c.name} (${c.phone})`]);
    }
  }

  async function trigger() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setCallLog([]);
    cancelled.current = false;
    if (!silent) Vibration.vibrate(400);

    for (let s = CANCEL_SECONDS; s > 0; s--) {
      setCountdown(s);
      await wait(1000);
      if (cancelled.current) {
        setCountdown(null);
        setBusy(false);
        return;
      }
    }
    setCountdown(null);

    try {
      const coords = await getCurrentCoordinates();
      setActiveAlert(await createAlertRequest(coords));
    } catch {
      setError("No se pudo enviar tu alerta. Revisa los permisos de ubicación e inténtalo de nuevo.");
    }
    await simulateCalls();
    setBusy(false);
  }

  function cancel() {
    cancelled.current = true;
  }

  return { trigger, cancel, countdown, callLog, error, busy, active: !!activeAlert };
}
