import axios from "axios";
import Constants from "expo-constants";
import { useAuthStore } from "@/store/authStore";

const apiUrl = Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:4000/api";

export const apiClient = axios.create({ baseURL: apiUrl });

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
