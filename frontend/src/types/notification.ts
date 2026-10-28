export interface Notification {
  id: string;
  title: string;
  body: string;
  place?: string | null;
  severity?: string | null;
  severityRef?: { label: string; color: string } | null;
  createdAt: string;
}
