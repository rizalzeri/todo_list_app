const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  // Seed for Categories
  await prisma.category.createMany({
    data: [
      { id: 1, name: 'Work' },
      { id: 2, name: 'Personal' },
      { id: 3, name: 'Urgent' },
    ],
    skipDuplicates: true, // Avoid duplicate entries
  });

  // Seed for Statuses
  await prisma.status.createMany({
    data: [
      { id: 1, status_name: 'Completed' },
      { id: 2, status_name: 'Incomplete' },
    ],
    skipDuplicates: true, // Avoid duplicate entries
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });