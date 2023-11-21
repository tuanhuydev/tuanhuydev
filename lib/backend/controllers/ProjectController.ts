import { BaseController } from '@lib/shared/interfaces/controller';
import Network from '@lib/shared/utils/network';
import { NextRequest } from 'next/server';
import { ObjectSchema, object, string, date, array } from 'yup';

import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';
import { ObjectType } from '@shared/interfaces/base';

import LogService from '../services/LogService';
import ProjectService from '../services/ProjectService';

export class ProjectController implements BaseController {
	#schema: ObjectSchema<any>;
	static #instance: ProjectController;

	static makeInstance() {
		return ProjectController.#instance ?? new ProjectController();
	}

	constructor() {
		this.#schema = object({
			name: string().required(),
			description: string().required(),
			thumbnail: string().nullable(),
			startDate: date().nullable(),
			endDate: date().nullable(),
			users: array().of(string()).nullable(),
		});
	}

	async validateStoreRequest(body: any) {
		try {
			return this.#schema.validate(body);
		} catch (error) {
			throw new BadRequestError();
		}
	}

	async store(request: NextRequest) {
		const network = Network(request);
		try {
			const body = await request.json();
			const validatedBody = await this.validateStoreRequest(body);
			const newProject = await ProjectService.createProject(validatedBody);

			return network.successResponse(newProject);
		} catch (error) {
			LogService.log((error as Error).message);
			return network.failResponse(error as BaseError);
		}
	}

	async getAll(request: NextRequest) {
		const network = Network(request);
		try {
			const params: ObjectType = network.extractSearchParams();
			const projects = await ProjectService.getProjects(params);

			return network.successResponse(projects);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async getOne(request: NextRequest, { id }: any) {
		const network = Network(request);
		try {
			if (!id) throw new BadRequestError();
			const projectById = await ProjectService.getProject(id);
			return network.successResponse(projectById);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async update(request: NextRequest, { id }: any) {
		const body = await request.json();
		if (!id || !body) throw new BadRequestError();

		const network = Network(request);
		try {
			const updated = await ProjectService.updateProject(Number(id), body);
			return network.successResponse(updated);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async delete(request: NextRequest, { id }: any) {
		if (!id) throw new BadRequestError();
		const network = Network(request);
		try {
			const deleted = await ProjectService.deleteProject(Number(id));
			return network.successResponse(deleted);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}
}

export default ProjectController.makeInstance();
