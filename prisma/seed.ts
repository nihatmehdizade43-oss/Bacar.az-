// Purpose: Seed database with demo users, jobs, mentors and startup ideas.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("12345678", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@bacar.az",
        name: "Bacar Admin",
        role: "admin",
        city: "Baku",
        bio: "Platform administrator.",
        skills: ["management", "ops"],
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: "eli@bacar.az",
        name: "Eli Hasanov",
        role: "user",
        city: "Baku",
        bio: "Frontend developer.",
        mentor: true,
        skills: ["react", "nextjs", "tailwind"],
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: "gunel@bacar.az",
        name: "Gunel Mammadova",
        role: "user",
        city: "Sumqayit",
        bio: "UI/UX designer.",
        mentor: true,
        skills: ["figma", "ui", "branding"],
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: "ramin@bacar.az",
        name: "Ramin Aliyev",
        role: "user",
        city: "Ganja",
        bio: "Mobile engineer.",
        skills: ["react native", "flutter"],
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: "leyla@bacar.az",
        name: "Leyla Safarli",
        role: "user",
        city: "Baku",
        bio: "Startup founder.",
        mentor: true,
        skills: ["startup", "pitch", "growth"],
        passwordHash,
      },
    }),
  ]);

  const normalUsers = users.filter((u) => u.role === "user");

  const jobs: [string, string, number, number][] = [
      ["Landing redesign", "UI/UX", 900, 14],
      ["Next.js blog platform", "Development", 1400, 20],
      ["Social media campaign", "Marketing", 700, 10],
      ["Logo + brand package", "Design", 600, 7],
      ["MVP API integration", "Development", 1800, 21],
      ["Short-form video editing", "Video", 450, 5],
      ["Product copywriting", "Content", 500, 6],
      ["Startup pitch deck", "Startup", 1200, 12],
    ];

  await Promise.all(
    jobs.map((item, index) =>
      prisma.job.create({
        data: {
          title: item[0],
          description: `${item[0]} for Bacar ecosystem.`,
          category: item[1],
          budget: item[2],
          deadlineDays: item[3],
          status: "active",
          authorId: normalUsers[index % normalUsers.length].id,
        },
      }),
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
