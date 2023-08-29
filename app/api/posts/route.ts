import { NextRequest } from 'next/server';

import PostController from '@backend/controllers/PostController';
import withAuthMiddleware from '@backend/middlewares/authMiddleware';

const handlePost = withAuthMiddleware(async (request: NextRequest) => PostController.store(request));

export async function GET(request: NextRequest, { params }: any) {
	return PostController.getAll(request);
}

export async function POST(request: NextRequest, { params }: any) {
	return handlePost(request, params);
}
