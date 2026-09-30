import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "@/navigation/types";
import { HomeScreen } from "@/screens/home/HomeScreen";
import { SafetyPointsScreen } from "@/screens/home/SafetyPointsScreen";
import { colors } from "@/theme";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.backgroundElevated },
        headerTintColor: colors.textOnDark,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="SafetyPoints"
        component={SafetyPointsScreen}
        options={{ title: "Puntos de seguridad" }}
      />
    </Stack.Navigator>
  );
}
