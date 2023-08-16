import PostController from 'lib/backend/controllers/PostController';
import withAuthMiddleware from 'lib/backend/middlewares/authMiddleware';
import { NextRequest } from 'next/server';

const handlePost = withAuthMiddleware(async (request: NextRequest, params: any) => PostController.store(request));

export async function GET(request: NextRequest) {
	return PostController.getAll(request);
}

export async function POST(request: NextRequest, { params }: any) {
	return handlePost(request, params);
}
