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
  Access: undefined;
  Map: undefined;
  Contacts: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type IncidentsStackParamList = {
  IncidentList: undefined;
  ReportIncident: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  ConfigTables: undefined;
  ConfigTable: { table: import("@/types/config").ConfigTable };
  ConfigRowForm: {
    table: import("@/types/config").ConfigTable;
    row?: import("@/types/config").ConfigRow;
  };
};
