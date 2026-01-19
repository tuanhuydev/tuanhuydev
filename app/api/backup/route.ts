import { postRepository } from "@server/repositories/MongoPostRepository";
import { userRepository } from "@server/repositories/MongoUserRepository";
import { NextResponse } from "next/server";
import { permissionRepository } from "server/repositories/MongoPermissionRepository";
import MongoProjectRepository from "server/repositories/MongoProjectRepository";
import { mongoTaskRepository } from "server/repositories/MongoTaskRepository";

export async function GET() {
  const posts = await postRepository.findAll();
  const permissions = await permissionRepository.findAll();
  const projects = await MongoProjectRepository.getProjects();
  const tasks = await mongoTaskRepository.findAll({});
  const users = await userRepository.findAll({});

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
