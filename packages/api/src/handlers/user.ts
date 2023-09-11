import { PrismaClient, User } from "models";

export async function createUser(prisma: PrismaClient, event: any) {
  try {
    const data = JSON.parse(event.body);
    const user = await prisma.user.create({ data });
    return { statusCode: 201, body: JSON.stringify(user) };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}

export async function getUser(prisma: PrismaClient, event: any) {
  try {
    const { id } = event.pathParameters;
    const user = await prisma.user.findUnique({ where: { id } });
    return { statusCode: 200, body: JSON.stringify(user) };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}

export async function updateUser(
  prisma: PrismaClient,
  body: string,
  loggedInUserId: string
) {
  const userData: Partial<User> = JSON.parse(body);

  if (!userData.id) {
    throw new Error("User ID is required");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userData.id },
    data: {
      ...userData,
      updatedBy: loggedInUserId,
      updatedAt: new Date(),
    },
  });

  return { statusCode: 200, body: JSON.stringify(updatedUser) };
}

export async function deleteUser(
  prisma: PrismaClient,
  userId: string,
  loggedInUserId: string
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const deletedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      deletedBy: loggedInUserId,
      deletedAt: new Date(),
    },
  });

  return { statusCode: 200, body: JSON.stringify(deletedUser) };
}
