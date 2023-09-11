import { PrismaClient, Workspace } from "models";

export async function createWorkspace(prisma: PrismaClient, event: any) {
  try {
    const data = JSON.parse(event.body);
    const workspace = await prisma.workspace.create({ data });
    return { statusCode: 201, body: JSON.stringify(workspace) };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}

export async function getWorkspace(prisma: PrismaClient, event: any) {
  try {
    const { id } = event.pathParameters;
    const workspace = await prisma.workspace.findUnique({ where: { id } });
    return { statusCode: 200, body: JSON.stringify(workspace) };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}

export async function updateWorkspace(
  prisma: PrismaClient,
  body: string,
  loggedInUserId: string
) {
  const workspaceData: Partial<Workspace> = JSON.parse(body);

  if (!workspaceData.id) {
    throw new Error("Workspace ID is required");
  }

  const updatedWorkspace = await prisma.workspace.update({
    where: { id: workspaceData.id },
    data: {
      ...workspaceData,
      updatedBy: loggedInUserId,
      updatedAt: new Date(),
    },
  });

  return { statusCode: 200, body: JSON.stringify(updatedWorkspace) };
}

export async function deleteWorkspace(
  prisma: PrismaClient,
  workspaceId: string,
  loggedInUserId: string
) {
  if (!workspaceId) {
    throw new Error("Workspace ID is required");
  }

  const deletedWorkspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      deletedBy: loggedInUserId,
      deletedAt: new Date(),
    },
  });

  return { statusCode: 200, body: JSON.stringify(deletedWorkspace) };
}
