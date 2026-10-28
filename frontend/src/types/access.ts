export interface AccessPass {
  id: string;
  token: string;
  /** Text encoded in the QR ("SAFECAMPUS:<token>"). */
  qrValue: string;
  zoneName: string;
  zoneDetail?: string | null;
  requestedAt: string;
  requestDate: string;
  requestTime: string;
  expiresAt: string;
  revokedAt?: string | null;
  usedAt?: string | null;
  /** Server clock when the response was built; used to correct device clock skew. */
  serverTime: string;
}
