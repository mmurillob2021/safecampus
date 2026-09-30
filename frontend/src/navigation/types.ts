export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  SafetyPoints: { query: string };
};

export type AppTabParamList = {
  Home: undefined;
  Sos: undefined;
  Incidents: undefined;
  Map: undefined;
  Contacts: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type IncidentsStackParamList = {
  IncidentList: undefined;
  ReportIncident: undefined;
};
