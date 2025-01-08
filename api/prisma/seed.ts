import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: 'user.development@kino.com',
      firstName: 'Kino',
      lastName: 'Dev',
      role: 'USER',
      clerkID: 'user_2oRHH28SU0wVY6CrFY2mu8WepWQ',
    },
  });

  await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      email: 'user.admin@kino.com',
      firstName: 'Kino',
      lastName: 'Admin',
      role: 'ADMIN',
      clerkID: 'user_2oRHH28SU0wVY6CrFY2mu8WepWQ',
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
