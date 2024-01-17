import { Permissions } from "../../lib/shared/commons/constants/permissions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.permission.createMany({
    data: [
      { id: 1, name: "root" },
      { id: 2, name: "maintainer" },
      { id: 3, name: "guest" },
    ],
    skipDuplicates: true,
  });
  await prisma.user.createMany({
    data: [
      {
        id: "2e633db0-dc69-11ed-afa1-0242ac120002",
        email: "root@tuanhuydev.com",
        password: "$2a$12$ymKDy1PXorHQJuhCqurBAuSX3azrpGmZE3AcppE0Jt57.XY2oOeqO", // 123456789
        name: "Huy Nguyen Tuan",
        deletedAt: null,
        permissionId: 1,
      },
      {
        id: "2e633db0-dc69-11ed-afa1-0242ac120003",
        email: "dev@tuanhuydev.com",
        password: "$2a$12$ymKDy1PXorHQJuhCqurBAuSX3azrpGmZE3AcppE0Jt57.XY2oOeqO", // 123456789
        name: "dev 1",
        deletedAt: null,
        permissionId: 2,
      },
      {
        id: "2e633db0-dc69-11ed-afa1-0242ac120004",
        email: "pm@tuanhuydev.com",
        password: "$2a$12$ymKDy1PXorHQJuhCqurBAuSX3azrpGmZE3AcppE0Jt57.XY2oOeqO", // 123456789
        name: "project manager 1",
        deletedAt: null,
        permissionId: 2,
      },
    ],
    skipDuplicates: true,
  });
  await prisma.role.createMany({
    data: [
      { id: 1, name: "Guest", description: "Default guest" },
      { id: 2, name: "Project Owner", description: "Project owner" },
    ],
    skipDuplicates: true,
  });

  await prisma.status.createMany({
    data: [
      {
        id: 1,
        name: "Default Task",
        description: "Default task status",
        color: "",
        type: "task",
      },
      {
        id: 2,
        name: "Default Project",
        description: "Default project status",
        color: "",
        type: "project",
      },
      {
        id: 3,
        name: "Default User",
        description: "Default user status",
        color: "",
        type: "project",
      },
    ],
    skipDuplicates: true,
  });

  const resourceData = Object.values(Permissions).map((name, id) => ({ id, name }));
  await prisma.resource.createMany({
    data: resourceData,
    skipDuplicates: true,
  });

  const resourcePermissionData = resourceData.map(({ id }) => ({
    permissionId: 1,
    resourceId: id,
    resourceType: "feature",
  }));

  await prisma.resourcePermission.createMany({
    data: [...resourcePermissionData, { permissionId: 2, resourceId: 2, resourceType: "feature" }],
    skipDuplicates: true,
  });
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
