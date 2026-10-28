import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Every block is idempotent: running the seed twice does not duplicate rows,
// and it never overwrites values an admin already changed in the config module.

async function seedUsers() {
  const passwordHash = await bcrypt.hash("Test1234!", 10);
  const users = [
    { fullName: "Demo Student", email: "student@safecampus.dev", role: "STUDENT", studentId: "STU-2024-001", phone: "+1-555-1001" },
    { fullName: "Demo Security", email: "security@safecampus.dev", role: "SECURITY", phone: "+1-555-1002" },
    { fullName: "Demo Admin", email: "admin@safecampus.dev", role: "ADMIN", phone: "+1-555-1003" },
  ];
  for (const u of users) {
    await prisma.user.upsert({ where: { email: u.email }, update: {}, create: { ...u, passwordHash } });
  }
  console.log("✅ Test users");
}

async function seedIncidentCategories() {
  const categories = [
    { code: "HARASSMENT", label: "Acoso", order: 1 },
    { code: "THEFT", label: "Hurto", order: 2 },
    { code: "ACCIDENT", label: "Accidente", order: 3 },
    { code: "MEDICAL_EMERGENCY", label: "Emergencia médica", order: 4 },
    { code: "FIRE", label: "Incendio", order: 5 },
    { code: "INFRASTRUCTURE", label: "Infraestructura", order: 6 },
    { code: "SUBSTANCES", label: "Sustancias", order: 7 },
    { code: "OTHER", label: "Otro", order: 8 },
    // Legacy codes from the first API version, kept for old reports.
    { code: "SUSPICIOUS_ACTIVITY", label: "Actividad sospechosa", order: 9, active: false },
    { code: "VANDALISM", label: "Vandalismo", order: 10, active: false },
  ];
  for (const c of categories) {
    await prisma.incidentCategory.upsert({ where: { code: c.code }, update: {}, create: c });
  }
  console.log("✅ Incident categories");
}

async function seedSeverityLevels() {
  const levels = [
    { code: "LOW", label: "Baja", color: "#3B8F5C", order: 1 },
    { code: "MEDIUM", label: "Media", color: "#2F55C7", order: 2 },
    { code: "HIGH", label: "Alta", color: "#A83220", order: 3 },
    { code: "CRITICAL", label: "Crítica", color: "#6E1A10", order: 4 },
  ];
  for (const l of levels) {
    await prisma.severityLevel.upsert({ where: { code: l.code }, update: {}, create: l });
  }
  console.log("✅ Severity levels");
}

async function seedSafetyPoints() {
  if ((await prisma.safetyPoint.count()) > 0) return console.log("⏭️  Safety points already present");
  // Bogotá, Universidad Nacional de Colombia campus area.
  await prisma.safetyPoint.createMany({
    data: [
      { title: "Punto de seguridad", description: "Portería principal", latitude: 4.6356, longitude: -74.0825, order: 1 },
      { title: "Enfermería", description: "Atención médica 24h", latitude: 4.6401, longitude: -74.0852, order: 2 },
      { title: "Zona de encuentro", description: "Plaza Che", latitude: 4.6385, longitude: -74.0871, order: 3 },
      { title: "Cámara de vigilancia", description: "Calle 26 con Carrera 30", latitude: 4.6372, longitude: -74.0805, order: 4 },
    ],
  });
  console.log("✅ Safety points");
}

async function seedOfficialContacts() {
  if ((await prisma.officialContact.count()) > 0) return console.log("⏭️  Official contacts already present");
  await prisma.officialContact.createMany({
    data: [
      { label: "Seguridad Campus", phone: "601 555 0100", order: 1 },
      { label: "Centro de salud del campus", phone: "601 555 0200", order: 2 },
      { label: "Bomberos", phone: "119", order: 3 },
      { label: "Policía", phone: "123", order: 4 },
    ],
  });
  console.log("✅ Official contacts");
}

async function seedSettings() {
  const settings = [
    { key: "campus.name", label: "Nombre del campus", value: "Campus Norte · Ingeniería de Sistemas", description: "Subtítulo del saludo en Inicio." },
    { key: "campus.status", label: "Estado del campus", value: "Operación normal", description: "Tarjeta de estado en Inicio." },
    { key: "map.center.latitude", label: "Latitud del centro del mapa", value: "4.6382" },
    { key: "map.center.longitude", label: "Longitud del centro del mapa", value: "-74.0840" },
    { key: "map.legend", label: "Leyenda del mapa", value: "Puntos de seguridad del campus e incidentes reportados." },
    { key: "campus.timezone", label: "Zona horaria del campus", value: "America/Bogota", description: "Zona IANA usada para la fecha y hora de las solicitudes de QR." },
    { key: "access.pass.minutes", label: "Vigencia del pase QR (minutos)", value: "5", description: "Tiempo que el QR de acceso es válido." },
    { key: "access.zone.name", label: "Zona del pase de acceso", value: "Zona de investigación", description: "Título de la tarjeta del pase QR." },
    { key: "access.zone.detail", label: "Detalle de la zona", value: "Laboratorios avanzados · Bloque F", description: "Subtítulo de la tarjeta del pase QR." },
  ];
  for (const s of settings) {
    await prisma.appSetting.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log("✅ App settings");
}

async function seedNotifications() {
  if ((await prisma.notification.count()) > 0) return console.log("⏭️  Notifications already present");
  const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);
  await prisma.notification.createMany({
    data: [
      {
        title: "Restricción de acceso",
        body: "El bloque D permanecerá cerrado hoy entre las 2:00 pm y las 6:00 pm por trabajos de mantenimiento.",
        place: "Bloque D · Parqueadero norte",
        severity: "HIGH",
        createdAt: minutesAgo(15),
      },
      {
        title: "Alerta climática",
        body: "Se esperan lluvias fuertes a partir de las 3:00 pm. Evita zonas descubiertas en el campus.",
        place: "Campus general",
        severity: "MEDIUM",
        createdAt: minutesAgo(42),
      },
      {
        title: "Actualización de protocolo",
        body: "El protocolo de evacuación fue actualizado. Revisa los nuevos puntos de encuentro en el mapa.",
        place: "Todos los bloques",
        severity: "LOW",
        createdAt: minutesAgo(120),
      },
    ],
  });
  console.log("✅ Sample institutional alerts");
}

async function main() {
  await seedUsers();
  await seedIncidentCategories();
  await seedSeverityLevels();
  await seedSafetyPoints();
  await seedOfficialContacts();
  await seedSettings();
  await seedNotifications();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
