import BaseError from '@lib/shared/commons/errors/BaseError';
import { Project } from '@prisma/client';
import prismaClient from '@prismaClient/prismaClient';

import { FilterType, ObjectType } from '@shared/interfaces/base';

import LogService from './LogService';

export type CreateProjectBody = Pick<Project, 'name' | 'description' | 'thumbnail'>;

class ProjectService {
	static #instance: ProjectService;

	static makeSingleton() {
		if (ProjectService.#instance) {
			return ProjectService.#instance;
		}
		return new ProjectService();
	}

	async createProject(body: CreateProjectBody) {
		return prismaClient.project.create({ data: body });
	}

	async getProjects(filter?: FilterType) {
		try {
			let defaultWhere: ObjectType = { deletedAt: null };
			if (!filter) return await prismaClient.project.findMany({ where: defaultWhere });

			const { page = 1, pageSize = 10, orderBy = [{ field: 'createdAt', direction: 'desc' }], search = '' } = filter;

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
				take: pageSize,
				skip: (page - 1) * pageSize,
				orderBy: orderBy.map((order) => ({
					[order.field]: order.direction.toLowerCase(),
				})),
			};
			return await prismaClient.project.findMany(query);
		} catch (error) {
			throw new BaseError((error as Error).message);
		}
	}

	async getProject(id: string) {
		try {
			return await prismaClient.project.findFirst({ where: { deletedAt: null, id: parseInt(id, 10) } });
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
