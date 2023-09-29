import prismaClient from '@prismaClient/prismaClient';

import BaseError from '@shared/commons/errors/BaseError';
import { ObjectType } from '@shared/interfaces/base';

export type UserFilter = {
	page?: number;
	pageSize?: number;
	search?: string;
	orderBy?: ObjectType[];
};

class UserService {
	static #instance: UserService;

	static makeSingleton() {
		if (UserService.#instance) {
			return UserService.#instance;
		}
		return new UserService();
	}

	async createUser(body: ObjectType) {
		try {
			const existingUser = await prismaClient.user.findFirst({ where: { email: body.email } });
			if (existingUser) throw new BaseError('User already existed');

			return await prismaClient.user.create({ data: body as any });
		} catch (error: any) {
			throw new BaseError((error as Error).message);
		}
	}

	async getUsers(filter?: UserFilter) {
		let defaultWhere: ObjectType = { deletedAt: null };
		if (!filter) return await prismaClient.user.findMany({ where: defaultWhere });
		const { page = 1, pageSize = 10, orderBy = [{ field: 'createdAt', direction: 'desc' }], search = '' } = filter;

		if (search) {
			defaultWhere = {
				...defaultWhere,
				name: { contains: search },
			};
		}
		let query: any = {
			where: {
				deletedAt: null,
				name: {
					contains: search,
				},
			},
			take: pageSize,
			skip: (page - 1) * pageSize,
			orderBy: orderBy.map((order) => ({
				[order.field]: order.direction.toLowerCase(),
			})),
		};
		try {
			return await prismaClient.user.findMany(query);
		} catch (error) {
			throw new BaseError((error as Error).message);
		}
	}

	async getUserById(id: string) {
		try {
			return await prismaClient.user.findFirst({ where: { id, deletedAt: null } });
		} catch (error) {
			throw new BaseError((error as Error).message);
		}
	}

	async updateUser(id: string, data: Object) {
		try {
			if (!id || !data) throw new BaseError();
			return await prismaClient.user.update({ where: { id }, data });
		} catch (error) {
			throw new BaseError((error as Error).message);
		}
	}
	async deleteUser(id: string) {
		try {
			if (!id) throw new BaseError();
			return await prismaClient.user.update({
				where: { id },
				data: { deletedAt: new Date() },
			});
		} catch (error) {
			throw new BaseError((error as Error).message);
		}
	}
}

export default UserService.makeSingleton();
