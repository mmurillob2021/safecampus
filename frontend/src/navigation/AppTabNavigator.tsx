import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { AppTabParamList } from "@/navigation/types";
import { HomeNavigator } from "@/navigation/HomeNavigator";
import { SosScreen } from "@/screens/sos/SosScreen";
import { IncidentsNavigator } from "@/navigation/IncidentsNavigator";
import { CampusMapScreen } from "@/screens/map/CampusMapScreen";
import { AccessPassScreen } from "@/screens/access/AccessPassScreen";
import { EmergencyContactsScreen } from "@/screens/contacts/EmergencyContactsScreen";
import { NotificationsScreen } from "@/screens/notifications/NotificationsScreen";
import { ProfileNavigator } from "@/navigation/ProfileNavigator";
import { colors } from "@/theme";

const Tab = createBottomTabNavigator<AppTabParamList>();

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<keyof AppTabParamList, { active: IconName; inactive: IconName; label: string }> = {
  Home: { active: "home", inactive: "home-outline", label: "Inicio" },
  Sos: { active: "shield", inactive: "shield-outline", label: "SOS" },
  Incidents: { active: "alert-circle", inactive: "alert-circle-outline", label: "Incidentes" },
  Access: { active: "qr-code", inactive: "qr-code-outline", label: "Acceso" },
  Map: { active: "map", inactive: "map-outline", label: "Mapa" },
  Contacts: { active: "call", inactive: "call-outline", label: "Contactos" },
  Notifications: { active: "notifications", inactive: "notifications-outline", label: "Alertas" },
  Profile: { active: "person", inactive: "person-outline", label: "Perfil" },
};

export function AppTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopWidth: 0,
          height: 64,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textOnDarkMuted,
        tabBarLabel: TAB_ICONS[route.name].label,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ focused, color }) => (
          <Ionicons
            name={focused ? TAB_ICONS[route.name].active : TAB_ICONS[route.name].inactive}
            size={focused ? 26 : 24}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Sos" component={SosScreen} />
      <Tab.Screen name="Incidents" component={IncidentsNavigator} />
      <Tab.Screen name="Access" component={AccessPassScreen} />
      <Tab.Screen name="Map" component={CampusMapScreen} />
      <Tab.Screen name="Contacts" component={EmergencyContactsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}
