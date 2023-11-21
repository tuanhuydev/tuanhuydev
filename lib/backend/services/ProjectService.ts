import BaseError from '@lib/shared/commons/errors/BaseError';
import { Project } from '@prisma/client';
import prismaClient from '@prismaClient/prismaClient';

import { FilterType, ObjectType } from '@shared/interfaces/base';

import LogService from './LogService';

export type CreateProjectBody = Pick<Project, 'name' | 'description' | 'thumbnail'> & {
	users: string[];
};

class ProjectService {
	static #instance: ProjectService;

	static makeSingleton() {
		if (ProjectService.#instance) {
			return ProjectService.#instance;
		}
		return new ProjectService();
	}

	async createProject({ users = [], ...restBody }: CreateProjectBody) {
		const project: Project = await prismaClient.project.create({ data: restBody });
		if (users.length) {
			const projectUsers = users.map((userId: string) => ({ projectId: project.id, userId, roleId: 1 }));
			await prismaClient.projectUser.createMany({ data: projectUsers });
		}
		return project;
	}

	async getProjects(filter?: FilterType) {
		try {
			let defaultWhere: ObjectType = { deletedAt: null };
			if (!filter)
				return await prismaClient.project.findMany({
					where: defaultWhere,
					include: {
						users: true,
					},
				});

			const { page, pageSize, orderBy = [{ field: 'createdAt', direction: 'desc' }], search = '' } = filter;

			if (search) {
				defaultWhere = {
					...defaultWhere,
					name: { startsWith: search, contains: search },
				};
			}
			if ('active' in filter) {
				defaultWhere = {
					...defaultWhere,
					publishedAt: filter?.active ? { not: null } : null,
				};
			}
			let query: any = {
				where: defaultWhere,
				include: {
					users: {
						select: {
							userId: true,
							roleId: true,
						},
					},
				},
				orderBy: orderBy.map((order) => ({
					[order.field]: order.direction.toLowerCase(),
				})),
			};
			if (page && pageSize) {
				query.take = pageSize;
				query.skip = (page - 1) * pageSize;
			} else if (pageSize) {
				query.take = pageSize;
			}

			return await prismaClient.project.findMany(query);
		} catch (error) {
			throw new BaseError((error as Error).message);
		}
	}

	async getProject(id: string) {
		try {
			return await prismaClient.project.findFirst({
				where: { deletedAt: null, id: parseInt(id, 10) },
				include: {
					users: true,
				},
			});
		} catch (error) {
			LogService.log((error as Error).message);
			throw new BaseError((error as Error).message);
		}
	}

	async updateProject(id: number, data: ObjectType) {
		return await prismaClient.project.update({ where: { id }, data });
	}

	async deleteProject(id: number) {
		return await prismaClient.project.update({ where: { id }, data: { deletedAt: new Date() } });
	}
}

export default ProjectService.makeSingleton();
