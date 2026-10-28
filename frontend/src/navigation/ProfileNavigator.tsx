import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "@/navigation/types";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";
import { ConfigTablesScreen } from "@/screens/config/ConfigTablesScreen";
import { ConfigTableScreen } from "@/screens/config/ConfigTableScreen";
import { ConfigRowFormScreen } from "@/screens/config/ConfigRowFormScreen";
import { colors } from "@/theme";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.backgroundElevated },
        headerTintColor: colors.textOnDark,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ConfigTables" component={ConfigTablesScreen} options={{ title: "Configuración" }} />
      <Stack.Screen
        name="ConfigTable"
        component={ConfigTableScreen}
        options={({ route }) => ({ title: route.params.table.label })}
      />
      <Stack.Screen
        name="ConfigRowForm"
        component={ConfigRowFormScreen}
        options={({ route }) => ({ title: route.params.row ? "Editar registro" : "Nuevo registro" })}
      />
    </Stack.Navigator>
  );
}
