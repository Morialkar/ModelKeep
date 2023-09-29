import { createUser, deleteUser, getUser, updateUser } from "./handlers/user";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  updateWorkspace,
} from "./handlers/workspace";
import { PrismaClient } from "models";
import jwt, { JwtHeader } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { getUnauthenticated } from "./handlers/unauthenticated.ts";
import { getAuthObjectFromAuthCode } from "./handlers/auth.ts";

// Configure the JWKS client
const client = jwksClient({
  jwksUri: process.env.JWKS_URI!,
});

function getSigningKey(
  header: JwtHeader,
  callback: (err: any, key?: string) => void
): void {
  if (!header.kid) {
    callback(new Error('JWT header is missing "kid" property'));
    return;
  }

  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err);
      return;
    }

    const signingKey = key?.getPublicKey();
    if (!signingKey) {
      callback(new Error("Unable to find a signing key"));
      return;
    }

    callback(null, signingKey);
  });
}

export async function handler(event: any, context: any) {
  const prisma = new PrismaClient();

  try {
    if (event.resource === "/unauthenticated" && event.httpMethod === "GET")
      return getUnauthenticated();

    if (
      event.resource === "/auth/getAuthObjectFromAuthCode" &&
      event.httpMethod === "GET"
    )
      return getAuthObjectFromAuthCode(event);

    const token = event.headers.Authorization;

    if (!token) {
      return { statusCode: 401, body: "No authentication present" };
    }

    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, getSigningKey, {
        algorithms: ["RS256"],
      });
    } catch (error) {
      return { statusCode: 401, body: "Invalid token" };
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            cognito_username: decodedToken["cognito:username"] as string,
          },
          {
            email: decodedToken.email as string,
          },
        ],
      },
    });

    if (!user) {
      return { statusCode: 404, body: "User not found" };
    }

    const route = {
      method: event.httpMethod,
      path: event.resource,
    };

    // Route to the appropriate handler based on the event
    switch (`${route.method} ${route.path}`) {
      case "POST /users":
        return createUser(prisma, event);
      case "GET /users/{id}":
        return getUser(prisma, event);
      case "PATCH /users/{id}":
        return updateUser(prisma, event.body, user.id);
      case "DELETE /users/{id}":
        return deleteUser(prisma, event.pathParameters.id, user.id);
      case "POST /workspaces":
        return createWorkspace(prisma, event);
      case "GET /workspaces/{id}":
        return getWorkspace(prisma, event);
      case "PATCH /workspaces/{id}":
        return updateWorkspace(prisma, event.body, user.id);
      case "DELETE /workspaces/{id}":
        return deleteWorkspace(prisma, event.pathParameters.id, user.id);
      // Define routes for other CRUD operations and models
    }
  } finally {
    await prisma.$disconnect();
  }
  // Handle unexpected routes
  return { statusCode: 400, body: "Unknown route" };
}
