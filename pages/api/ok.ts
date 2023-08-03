import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

// Create a single instance of PrismaClient and reuse it across all requests
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
	try {
		if (!prisma.$disconnect) {
			await prisma.$connect();
		}

		res.status(200).send('Ok');
	} catch (error) {
		console.error('Error executing database operation:', error);
		res.status(500).send('Internal Server Error');
	}
}

// Make sure to close the Prisma client when the server is shut down
// This is important to release resources and close database connections properly
export function cleanup() {
	prisma.$disconnect();
}

// Make sure to call the cleanup function when the server is shut down
process.on('SIGINT', async () => {
	await cleanup();
	process.exit(0);
});
