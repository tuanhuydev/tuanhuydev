import { ObjectType } from '@lib/shared/interfaces/base';
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import QueryString from 'qs';

export const userApis = (builder: EndpointBuilder<BaseQueryFn, any, 'api'>) => ({
	getUsers: builder.query({
		query: (filter?: any) => {
			return filter ? `users?${QueryString.stringify(filter)}` : `users`;
		},
		providesTags: (result: any) => {
			const defaultTag = { type: 'User', id: 'LIST' };
			if (result) {
				const resultTags = result.map(({ id }: ObjectType) => ({ type: 'User' as const, id }));
				return [...resultTags, defaultTag];
			}
			return [defaultTag];
		},
		transformResponse: (response: ObjectType) => response.data,
	}),
	getUser: builder.query({
		query: (id) => `users/${id}`,
		providesTags: (_result, _error, id) => [{ type: 'User', id }],
		transformResponse: (response: ObjectType) => response.data,
	}),
	createUser: builder.mutation<any, any>({
		query: (body) => ({ url: 'users', method: 'POST', body }),
		invalidatesTags: ['User'],
	}),
	updateUser: builder.mutation<any, any>({
		query: ({ id, body }) => ({ url: `users/${id}`, method: 'PATCH', body }),
		invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
	}),
	deleteUser: builder.mutation({
		query: (id) => ({ url: `users/${id}`, method: 'DELETE' }),
		invalidatesTags: (_result, _error, { id }: any) => [{ type: 'User', id }],
	}),
});
