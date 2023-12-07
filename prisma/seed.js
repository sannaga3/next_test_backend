const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword1 = await bcrypt.hash("password1", 10);
  const hashedPassword2 = await bcrypt.hash("password2", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "user1",
        email: "user1@example.com",
        password: hashedPassword1,
      },
    }),
    prisma.user.create({
      data: {
        username: "user2",
        email: "user2@example.com",
        password: hashedPassword2,
      },
    }),
  ]);

  const posts = await Promise.all(
    users.map(async (user) => {
      return prisma.post.createMany({
        data: [
          {
            title: "Post 1 for User " + user.username,
            content: "Content for Post 1",
            userId: user.id,
          },
          {
            title: "Post 2 for User " + user.username,
            content: "Content for Post 2",
            userId: user.id,
          },
        ],
      });
    })
  );
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
