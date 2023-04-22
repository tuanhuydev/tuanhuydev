// Reference to the issue https://github.com/prisma/prisma/issues/13672
import { PrismaClient } from '.prisma/client';

/**
 * Initialize connection to DB
 */
const prismaClient = new PrismaClient();

try {
	prismaClient.$connect;
} catch (error) {
	console.log('Unable to connect to database', error);
}
export default prismaClient;
