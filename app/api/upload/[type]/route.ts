import { NextRequest } from 'next/server';

import StorageController from '@backend/controllers/StorageController';
import withAuthMiddleware from '@backend/middlewares/authMiddleware';

const handlePost = withAuthMiddleware(async (request: NextRequest, params: any) =>
	StorageController.uploadFile(request, params)
);

export async function POST(request: NextRequest, { params }: any) {
	return handlePost(request, params);
}
