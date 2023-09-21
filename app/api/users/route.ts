import { NextRequest } from 'next/server';

import UserController from '@backend/controllers/UserController';
import withAuthMiddleware from '@backend/middlewares/authMiddleware';

const handlePost = withAuthMiddleware(async (request: NextRequest, params: any) =>
	UserController.store(request, params)
);
const handleGetAll = withAuthMiddleware(async (request: NextRequest) => UserController.getAll(request));

export async function GET(request: NextRequest, { params }: any) {
	return handleGetAll(request, params);
}

export async function POST(request: NextRequest, { params }: any) {
	return handlePost(request, params);
}
