import "dotenv/config";
import { readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import { cert, initializeApp as initAdminApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { initializeApp as initWebApp } from "firebase/app";
import { doc, getFirestore as getWebFirestore, terminate, writeBatch } from "firebase/firestore";

const prisma = new PrismaClient();

// Copies every SQLite table into a Firestore collection with the same name.
// Each row becomes a document whose id is the row's primary key, so running
// the sync twice overwrites the same documents instead of duplicating them.
// SQLite stays the source of truth; Firestore is a copy.

type Row = Record<string, unknown>;

interface FirestoreWriter {
  projectId: string;
  /** Writes up to 500 documents (Firestore's batch limit) in one commit. */
  commit(collection: string, docs: { id: string; data: Row }[]): Promise<void>;
  close(): Promise<void>;
}

/** firebase-admin with a service account: bypasses Firestore security rules. */
function adminWriter(keyPath: string): FirestoreWriter {
  const serviceAccount = JSON.parse(readFileSync(resolve(keyPath), "utf8")) as ServiceAccount & {
    project_id: string;
  };
  const db = getAdminFirestore(initAdminApp({ credential: cert(serviceAccount) }));
  return {
    projectId: serviceAccount.project_id,
    async commit(collection, docs) {
      const batch = db.batch();
      for (const d of docs) batch.set(db.collection(collection).doc(d.id), d.data);
      await batch.commit();
    },
    close: () => db.terminate(),
  };
}

/** Web SDK with the app config: only works while the Firestore rules allow writes. */
function webWriter(projectId: string, apiKey: string): FirestoreWriter {
  const db = getWebFirestore(initWebApp({ projectId, apiKey }));
  return {
    projectId,
    async commit(collection, docs) {
      const batch = writeBatch(db);
      for (const d of docs) batch.set(doc(db, collection, d.id), d.data);
      await batch.commit();
    },
    close: () => terminate(db),
  };
}

function createWriter(): FirestoreWriter {
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (keyPath) return adminWriter(keyPath);

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!projectId || !apiKey) {
    throw new Error("Set FIREBASE_SERVICE_ACCOUNT, or FIREBASE_PROJECT_ID and FIREBASE_API_KEY, in .env");
  }
  return webWriter(projectId, apiKey);
}

async function writeCollection<T extends Row>(
  writer: FirestoreWriter,
  name: string,
  rows: T[],
  idOf: (row: T) => string,
) {
  for (let i = 0; i < rows.length; i += 500) {
    await writer.commit(name, rows.slice(i, i + 500).map((row) => ({ id: idOf(row), data: row })));
  }
  console.log(`✅ ${name}: ${rows.length}`);
}

async function main() {
  const writer = createWriter();
  console.log(`🔥 Firebase project: ${writer.projectId}`);
  const byId = (row: { id: string }) => row.id;

  try {
    // passwordHash is left out on purpose: credentials stay in the backend only.
    const users = (await prisma.user.findMany()).map(({ passwordHash: _, ...user }) => user);
    await writeCollection(writer, "User", users, byId);

    await writeCollection(writer, "AppSetting", await prisma.appSetting.findMany(), (r) => r.key);
    await writeCollection(writer, "IncidentCategory", await prisma.incidentCategory.findMany(), (r) => r.code);
    await writeCollection(writer, "SeverityLevel", await prisma.severityLevel.findMany(), (r) => r.code);
    await writeCollection(writer, "OfficialContact", await prisma.officialContact.findMany(), byId);
    await writeCollection(writer, "SafetyPoint", await prisma.safetyPoint.findMany(), byId);
    await writeCollection(writer, "PersonalContact", await prisma.personalContact.findMany(), byId);
    await writeCollection(writer, "Notification", await prisma.notification.findMany(), byId);
    await writeCollection(writer, "NotificationRead", await prisma.notificationRead.findMany(), byId);
    await writeCollection(writer, "EmergencyAlert", await prisma.emergencyAlert.findMany(), byId);
    await writeCollection(writer, "Incident", await prisma.incident.findMany(), byId);
    await writeCollection(writer, "AccessPass", await prisma.accessPass.findMany(), byId);
  } finally {
    await writer.close();
  }
}

main()
  .catch((err) => {
    console.error("Firestore sync failed", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
