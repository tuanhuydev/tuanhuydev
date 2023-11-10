import { ObjectType } from '@lib/shared/interfaces/base';
import { BaseController } from '@lib/shared/interfaces/controller';
import Network from '@lib/shared/utils/network';
import { NextRequest } from 'next/server';
import { ObjectSchema, object, string, number } from 'yup';

import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';

import LogService from '../services/LogService';
import TaskService from '../services/TaskService';

export class TaskController implements BaseController {
	#schema: ObjectSchema<any>;
	static #instance: TaskController;

	static makeInstance() {
		return TaskController.#instance ?? new TaskController();
	}

	constructor() {
		this.#schema = object({
			title: string().required(),
			description: string().required(),
			projectId: number().nullable(),
		});
	}

	// makeResource(projects: any[]) {
	// 	return projects.map(({ ProjectUser: users, ...rest }: any) => ({ ...rest, users }));
	// }

	async validate(body: any, schema: ObjectSchema<any>) {
		try {
			return schema.validate(body);
		} catch (error) {
			throw new BadRequestError();
		}
	}

	async store(request: NextRequest) {
		const network = Network(request);
		try {
			const schema = object({
				title: string().required(),
				description: string().required(),
				projectId: number().nullable(),
			});

			const body = await request.json();
			const validatedBody = await this.validate(body, schema);
			const newTask = await TaskService.createTask(validatedBody);

			return network.successResponse(newTask);
		} catch (error) {
			LogService.log((error as Error).message);
			return network.failResponse(error as BaseError);
		}
	}

	async getAll(request: NextRequest) {
		const network = Network(request);
		try {
			const params: ObjectType = network.extractSearchParams();
			const tasks = await TaskService.getTasks(params);
			return network.successResponse(tasks);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async getOne(request: NextRequest, { id }: any) {
		const network = Network(request);
		try {
			if (!id) throw new BadRequestError();
			const projectById = await TaskService.getTask(id);
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
			const updated = await TaskService.updateTask(Number(id), body);
			return network.successResponse(updated);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async delete(request: NextRequest, { id }: any) {
		if (!id) throw new BadRequestError();
		const network = Network(request);
		try {
			const deleted = await TaskService.deleteTask(Number(id));
			return network.successResponse(deleted);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}
}

export default TaskController.makeInstance();
