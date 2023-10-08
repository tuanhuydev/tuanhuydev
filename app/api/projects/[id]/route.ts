import ProjectController from '@lib/backend/controllers/ProjectController';
import withAuthMiddleware from '@lib/backend/middlewares/authMiddleware';
import { ObjectType } from '@lib/shared/interfaces/base';
import { NextRequest } from 'next/server';

const handleGetOne = withAuthMiddleware(async (request: NextRequest, params: ObjectType) =>
	ProjectController.getOne(request, params)
);

const handleUpdate = withAuthMiddleware(async (request: NextRequest, params: any) => {
	return ProjectController.update(request, params);
});

const handleDelete = withAuthMiddleware(async (request: NextRequest, params: any) => {
	return ProjectController.delete(request, params);
});

export async function GET(request: NextRequest, { params }: any) {
	return handleGetOne(request, params);
}

export async function PATCH(request: NextRequest, { params }: any) {
	return handleUpdate(request, params);
}

export async function DELETE(request: NextRequest, { params }: any) {
	return handleDelete(request, params);
}
