import { ObjectType } from '@lib/shared/interfaces/base';
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import QueryString from 'qs';

export const taskApis = (builder: EndpointBuilder<BaseQueryFn, any, 'api'>) => ({
	getTasks: builder.query({
		query: (projectId, filter?: any) => {
			return filter ? `tasks/${projectId}?${QueryString.stringify(filter)}` : `tasks/${projectId}`;
		},
		providesTags: (result: any) => {
			const defaultTag = { type: 'Task', id: 'LIST' };
			if (result) {
				const resultTags = result.map(({ id }: ObjectType) => ({ type: 'Task' as const, id }));
				return [...resultTags, defaultTag];
			}
			return [defaultTag];
		},
		transformResponse: (response: ObjectType) => response.data,
	}),

	getTask: builder.query({
		query: (projectId) => `tasks/${projectId}`,
		providesTags: (_result, _error, id) => [{ type: 'Task', id }],
		transformResponse: (response: ObjectType) => response.data,
	}),

	createTask: builder.mutation<any, any>({
		query: ({ projectId, body }) => ({ url: `tasks/${projectId}`, method: 'POST', body }),
		invalidatesTags: ['Task'],
	}),
	updateTask: builder.mutation<any, any>({
		query: ({ projectId, taskId, body }) => ({ url: `tasks/${projectId}/${taskId}`, method: 'PATCH', body }),
		invalidatesTags: (_result, _error, { id }) => [{ type: 'Task', id }],
	}),
	deleteTask: builder.mutation({
		query: ({ projectId, taskId }) => ({ url: `tasks/${projectId}/${taskId}`, method: 'DELETE' }),
		invalidatesTags: (_result, _error, { id }: any) => [{ type: 'Task', id }],
	}),
});
