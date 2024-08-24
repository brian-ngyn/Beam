import { FLAGS, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const flags = Object.values(FLAGS);

  for (const flagName of flags) {
    const existingFlag = await prisma.featureFlags.findUnique({
      where: { flagName },
    });

    if (!existingFlag) {
      await prisma.featureFlags.create({
        data: {
          flagName,
          isEnabled: false,
        },
      });
      console.log(`Created flag: ${flagName}`);
    } else {
      console.log(`Flag already exists: ${flagName}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
