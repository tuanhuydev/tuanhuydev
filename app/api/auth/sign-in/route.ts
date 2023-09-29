import { NextRequest } from 'next/server';

import AuthController from '@backend/controllers/AuthController';

export async function POST(req: NextRequest) {
	return AuthController.signIn(req);
}
