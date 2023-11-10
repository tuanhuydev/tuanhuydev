import TaskController from '@lib/backend/controllers/TaskController';
import { NextRequest } from 'next/server';

import withAuthMiddleware from '@backend/middlewares/authMiddleware';

const handlePost = withAuthMiddleware(async (request: NextRequest) => TaskController.store(request));
const handleGetAll = withAuthMiddleware(async (request: NextRequest) => TaskController.getAll(request));

export async function GET(request: NextRequest) {
	return handleGetAll(request);
}

export async function POST(request: NextRequest) {
	return handlePost(request);
}
