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
        email: "tuanhuydev@gmail.com",
        password: "$2a$12$ymKDy1PXorHQJuhCqurBAuSX3azrpGmZE3AcppE0Jt57.XY2oOeqO", // 123456789
        name: "Huy Nguyen Tuan",
        deletedAt: null,
        permissionId: 1,
      },
      {
        id: "2e633db0-dc69-11ed-afa1-0242ac120003",
        email: "dev1@email.com",
        password: "$2a$12$ymKDy1PXorHQJuhCqurBAuSX3azrpGmZE3AcppE0Jt57.XY2oOeqO", // 123456789
        name: "dev 1",
        deletedAt: null,
        permissionId: 2,
      },
      {
        id: "2e633db0-dc69-11ed-afa1-0242ac120004",
        email: "pm1@email.com",
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
    data: [{ id: 1, name: "Default", description: "Default status", color: "" }],
    skipDuplicates: true,
  });

  await prisma.resource.createMany({
    data: [
      { id: 1, name: "Posts" },
      { id: 2, name: "Projects" },
      { id: 3, name: "Users" },
      { id: 4, name: "Tasks" },
    ],
    skipDuplicates: true,
  });
  await prisma.resourcePermission.createMany({
    data: [
      { permissionId: 1, resourceId: 1, resourceType: "feature" },
      { permissionId: 1, resourceId: 2, resourceType: "feature" },
      { permissionId: 1, resourceId: 3, resourceType: "feature" },
      { permissionId: 1, resourceId: 4, resourceType: "feature" },
      { permissionId: 2, resourceId: 2, resourceType: "feature" },
    ],
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
