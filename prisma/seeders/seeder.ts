import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	await prisma.user.createMany({
		data: [
			{
				id: '2e633db0-dc69-11ed-afa1-0242ac120002',
				email: 'tuanhuydev@gmail.com',
				password: '$2a$12$ymKDy1PXorHQJuhCqurBAuSX3azrpGmZE3AcppE0Jt57.XY2oOeqO', // 123456789
				name: 'Huy Nguyen Tuan',
				deletedAt: null,
			},
		],
		skipDuplicates: true,
	});
	await prisma.role.createMany({
		data: [
			{ id: 1, name: 'Guest', description: 'Default guest' },
			{ id: 2, name: 'Project Owner', description: 'Project owner' },
		],
		skipDuplicates: true,
	});

	await prisma.status.createMany({
		data: [{ id: 1, name: 'Default', description: 'Default status', color: '' }],
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
