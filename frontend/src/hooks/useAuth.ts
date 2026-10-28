import { useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useConfigStore } from "@/store/configStore";
import { loginRequest, registerRequest } from "@/services/api/auth.api";
import { connectSocket, disconnectSocket } from "@/services/socket";

export function useAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  const login = useCallback(
    async (email: string, password: string) => {
      const { token, user } = await loginRequest({ email, password });
      setSession(token, user);
      connectSocket(token);
    },
    [setSession],
  );

  const register = useCallback(
    async (input: Parameters<typeof registerRequest>[0]) => {
      const { token, user } = await registerRequest(input);
      setSession(token, user);
      connectSocket(token);
    },
    [setSession],
  );

  const logout = useCallback(() => {
    disconnectSocket();
    clearSession();
    useConfigStore.getState().clear();
  }, [clearSession]);

  return { login, register, logout };
}
