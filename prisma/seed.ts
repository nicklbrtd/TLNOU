import { PrismaClient, Role } from "@prisma/client";

import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function upsertUser(params: {
  identifier: string;
  password: string;
  displayName: string;
  username?: string;
  role?: Role;
  age?: number;
  bio?: string;
}) {
  const passwordHash = await hashPassword(params.password);

  await prisma.user.upsert({
    where: { identifier: params.identifier },
    update: {
      role: params.role ?? "USER",
      isActive: true,
      credential: {
        upsert: {
          update: {
            passwordHash,
            passwordUpdated: new Date(),
          },
          create: {
            passwordHash,
          },
        },
      },
      profile: {
        upsert: {
          update: {
            displayName: params.displayName,
            username: params.username ?? null,
            age: params.age ?? null,
            bio: params.bio ?? null,
          },
          create: {
            displayName: params.displayName,
            username: params.username ?? null,
            age: params.age ?? null,
            bio: params.bio ?? null,
          },
        },
      },
    },
    create: {
      identifier: params.identifier,
      role: params.role ?? "USER",
      credential: {
        create: {
          passwordHash,
        },
      },
      profile: {
        create: {
          displayName: params.displayName,
          username: params.username ?? null,
          age: params.age ?? null,
          bio: params.bio ?? null,
        },
      },
    },
  });
}

async function main() {
  const adminIdentifier = process.env.SEED_ADMIN_IDENTIFIER ?? "1001";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const adminName = process.env.SEED_ADMIN_NAME ?? "Администратор ТЛНОУ";

  await upsertUser({
    identifier: adminIdentifier,
    password: adminPassword,
    displayName: adminName,
    username: "admin_tlnou",
    role: "ADMIN",
    age: 25,
    bio: "Отвечаю за пространство ТЛНОУ и поддержку участников.",
  });

  const allUsers = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  const generalRoom = await prisma.chatRoom.upsert({
    where: { slug: "general" },
    update: {
      title: "Общий чат группы",
      isActive: true,
    },
    create: {
      slug: "general",
      title: "Общий чат группы",
      isActive: true,
    },
  });

  if (allUsers.length > 0) {
    await prisma.chatMember.createMany({
      data: allUsers.map((entry) => ({
        roomId: generalRoom.id,
        userId: entry.id,
      })),
      skipDuplicates: true,
    });
  }

  const importantRoom = await prisma.chatRoom.upsert({
    where: { slug: "3fvt-vazhnoe" },
    update: {
      title: "3ФВТ ВАЖНОЕ",
      isActive: true,
    },
    create: {
      slug: "3fvt-vazhnoe",
      title: "3ФВТ ВАЖНОЕ",
      isActive: true,
    },
  });

  if (allUsers.length > 0) {
    await prisma.chatMember.createMany({
      data: allUsers.map((entry) => ({
        roomId: importantRoom.id,
        userId: entry.id,
      })),
      skipDuplicates: true,
    });
  }

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
