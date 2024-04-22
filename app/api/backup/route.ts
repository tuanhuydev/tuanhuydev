import MongoPermissionRepository from "@lib/repositories/MongoPermissionRepository";
import MongoPostRepository from "@lib/repositories/MongoPostRepository";
import MongoProjectRepository from "@lib/repositories/MongoProjectRepository";
import MongoTaskRepository from "@lib/repositories/MongoTaskRepository";
import MongoUserRepository from "@lib/repositories/MongoUserRepository";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const posts = await MongoPostRepository.getPosts();
  const permissions = await MongoPermissionRepository.getPermissions();
  const projects = await MongoProjectRepository.getProjects();
  const tasks = await MongoTaskRepository.getTasks();
  const users = await MongoUserRepository.getUsers({});

  const dataJSON = {
    posts,
    projects,
    tasks,
    users,
    permissions,
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
}
