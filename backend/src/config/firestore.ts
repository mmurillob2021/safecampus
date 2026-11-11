import { readFileSync } from "fs";
import { resolve } from "path";
import { cert, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { env } from "@/config/env";

// Live mirror of selected SQLite rows into Firestore. SQLite stays the source
// of truth: a Firestore failure is logged and never fails the API request.
// Documents use the same collection names and ids as prisma/sync-firestore.ts,
// so the live mirror and the full sync write the same documents.

let db: Firestore | null | undefined;

function getDb(): Firestore | null {
  if (db !== undefined) return db;
  if (!env.firebaseServiceAccount) {
    console.warn("FIREBASE_SERVICE_ACCOUNT not set: Firestore mirror disabled");
    return (db = null);
  }
  const serviceAccount = JSON.parse(
    readFileSync(resolve(env.firebaseServiceAccount), "utf8"),
  ) as ServiceAccount;
  return (db = getFirestore(initializeApp({ credential: cert(serviceAccount) }, "mirror")));
}

/** Writes one row to `collection/id` in the background, replacing any previous copy. */
export function mirrorToFirestore(collection: string, id: string, data: Record<string, unknown>) {
  let firestore: Firestore | null;
  try {
    firestore = getDb();
  } catch (err) {
    console.error("Firestore mirror init failed", err);
    db = null;
    return;
  }
  if (!firestore) return;
  firestore
    .collection(collection)
    .doc(id)
    .set(data)
    .catch((err) => console.error(`Firestore mirror failed for ${collection}/${id}`, err));
}
