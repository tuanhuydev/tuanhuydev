// Reference to the issue https://github.com/prisma/prisma/issues/13672
import { PrismaClient } from '@prisma/client';

import BaseError from '@shared/commons/errors/BaseError';

// NextJS reload initialize prisma alot => implement singleton pattern
const cachedPrisma = global as unknown as { prisma: PrismaClient };
const singletonPrisma = cachedPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') cachedPrisma.prisma = singletonPrisma;

(async () => {
	try {
		const res = await singletonPrisma.$connect();
	} catch (error) {
		return new BaseError();
	}
})();

export default singletonPrisma;
