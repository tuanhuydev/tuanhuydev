import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

export default function handler(req: NextApiRequest, res: NextApiResponse<string>) {
	const prisma = new PrismaClient();
	console.log(prisma.$connect);
	res.status(200).send('Ok');
}
