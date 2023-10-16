import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// mock user
	await prisma.user.upsert({
		create: {
			id: '2e633db0-dc69-11ed-afa1-0242ac120002',
			email: 'tuanhuydev@gmail.com',
			password: '$2a$12$ymKDy1PXorHQJuhCqurBAuSX3azrpGmZE3AcppE0Jt57.XY2oOeqO', // 123456789
			name: 'Huy Nguyen Tuan',
			deletedAt: null,
		},
		where: {
			id: '2e633db0-dc69-11ed-afa1-0242ac120002',
		},
		update: {},
	});
	await prisma.role.upsert({
		create: {
			id: 1,
			name: 'Guest',
			description: 'Default guest',
		},
		where: { id: 1 },
		update: {},
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
