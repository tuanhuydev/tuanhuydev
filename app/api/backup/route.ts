import withAuthMiddleware from "@lib/middlewares/authMiddleware";
import prismaClient from "@prismaClient/prismaClient";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const handleBackup = withAuthMiddleware(async (request: NextRequest, params: any) => {
  const posts = await prismaClient.post.findMany({});
  const permissions = await prismaClient.permission.findMany({});
  const users = await prismaClient.user.findMany({});
  const resources = await prismaClient.resource.findMany({});
  const resourcePermissions = await prismaClient.resourcePermission.findMany({});
  const project = await prismaClient.project.findMany({});
  const tasks = await prismaClient.task.findMany({});
  const status = await prismaClient.status.findMany({});
  const roles = await prismaClient.role.findMany({});
  const projectUsers = await prismaClient.projectUser.findMany({});

  const dataJSON = {
    posts,
    project,
    tasks,
    users,
    permissions,
    resourcePermissions,
    projectUsers,
    resources,
    roles,
    status,
  };

  const fileName = "backup.json";
  const fileContent = JSON.stringify(dataJSON);

  const headers = {
    "content-type": "application/json",
    "content-disposition": `attachment; filename=${fileName}`,
  };

  const response = new NextResponse(fileContent, { headers });

  response.headers.set("Content-Type", "application/octet-stream");
  response.headers.set("Content-Disposition", `attachment; filename=${fileName}`);

  return response;
});

export async function GET(request: NextRequest) {
  return handleBackup(request);
}
