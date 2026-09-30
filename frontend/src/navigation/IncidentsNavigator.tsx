import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { IncidentsStackParamList } from "@/navigation/types";
import { IncidentListScreen } from "@/screens/incidents/IncidentListScreen";
import { ReportIncidentScreen } from "@/screens/incidents/ReportIncidentScreen";

const Stack = createNativeStackNavigator<IncidentsStackParamList>();

export function IncidentsNavigator() {
  return (
    <Stack.Navigator initialRouteName="ReportIncident" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IncidentList" component={IncidentListScreen} />
      <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} />
    </Stack.Navigator>
  );
}
