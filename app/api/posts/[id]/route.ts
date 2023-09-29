import { NextRequest } from 'next/server';

import PostController from '@backend/controllers/PostController';
import withAuthMiddleware from '@backend/middlewares/authMiddleware';

const handleUpdate = withAuthMiddleware(async (request: NextRequest, params: any) => {
	return PostController.update(request, params);
});

const handleDelete = withAuthMiddleware(async (request: NextRequest, params: any) => {
	return PostController.delete(request, params);
});

export async function GET(request: NextRequest, { params }: any) {
	return PostController.getOne(request, params);
}

export async function PATCH(request: NextRequest, { params }: any) {
	return handleUpdate(request, params);
}

export async function DELETE(request: NextRequest, { params }: any) {
	return handleDelete(request, params);
}
