import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Test users ---
  const passwordHash = await bcrypt.hash("Test1234!", 10);

  const testUsers = [
    {
      fullName: "Demo Student",
      email: "student@safecampus.dev",
      passwordHash,
      role: "STUDENT" as const,
      studentId: "STU-2024-001",
      phone: "+1-555-1001",
    },
    {
      fullName: "Demo Security",
      email: "security@safecampus.dev",
      passwordHash,
      role: "SECURITY" as const,
      phone: "+1-555-1002",
    },
    {
      fullName: "Demo Admin",
      email: "admin@safecampus.dev",
      passwordHash,
      role: "ADMIN" as const,
      phone: "+1-555-1003",
    },
  ];

  for (const u of testUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }
  console.log("✅ Test users created");

  // --- Official contacts ---
  await prisma.officialContact.createMany({
    data: [
      { label: "Campus Security", phone: "+1-555-0100", order: 1 },
      { label: "Campus Health Center", phone: "+1-555-0200", order: 2 },
      { label: "Fire Department", phone: "+1-555-0300", order: 3 },
      { label: "Local Police", phone: "+1-555-0400", order: 4 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Official contacts created");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
