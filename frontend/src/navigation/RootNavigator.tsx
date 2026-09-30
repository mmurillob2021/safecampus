import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore } from "@/store/authStore";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { AppTabNavigator } from "@/navigation/AppTabNavigator";

export function RootNavigator() {
  const token = useAuthStore((s) => s.token);

  return (
    <NavigationContainer>
      {token ? <AppTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
