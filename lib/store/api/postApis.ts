import { ObjectType } from '@lib/shared/interfaces/base';
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import QueryString from 'qs';

export const postApis = (builder: EndpointBuilder<BaseQueryFn, any, 'api'>) => ({
	getPosts: builder.query({
		query: (filter?: any) => {
			return filter ? `posts?${QueryString.stringify(filter)}` : `posts`;
		},
		providesTags: (result: any) => {
			const defaultTag = { type: 'Post', id: 'LIST' };
			if (result) {
				const resultTags = result.map(({ id }: ObjectType) => ({ type: 'Post' as const, id }));
				return [...resultTags, defaultTag];
			}
			return [defaultTag];
		},
		transformResponse: (response: ObjectType) => response.data,
	}),
	getPost: builder.query({
		query: (id) => `posts/${id}`,
		providesTags: (_result, _error, id) => [{ type: 'Post', id }],
		transformResponse: (response: ObjectType) => response.data,
	}),
	createPost: builder.mutation<any, any>({
		query: (body) => ({ url: 'posts', method: 'POST', body }),
		invalidatesTags: ['Post'],
	}),
	updatePost: builder.mutation<any, any>({
		query: ({ id, body }) => ({ url: `posts/${id}`, method: 'PATCH', body }),
		invalidatesTags: (_result, _error, { id }) => [{ type: 'Post', id }],
	}),
	deletePost: builder.mutation({
		query: (id) => ({ url: `posts/${id}`, method: 'DELETE' }),
		invalidatesTags: (_result, _error, { id }: any) => [{ type: 'Post', id }],
	}),
});
