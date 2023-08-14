'use client';

import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { REHYDRATE } from 'redux-persist';

import { ACCESS_TOKEN_LIFE } from '@shared/commons/constants/encryption';
import { STORAGE_CREDENTIAL_KEY } from '@shared/configs/constants';
import { ObjectType } from '@shared/interfaces/base';
import { getLocalStorage, setLocalStorage } from '@shared/utils/dom';

const baseQuery: BaseQueryFn = fetchBaseQuery({
	baseUrl: '/api',
	prepareHeaders: (headers, { getState, endpoint }) => {
		const accessToken = Cookies.get('jwt');

		if (accessToken) {
			headers.set('authorization', `Bearer ${accessToken}`);
		}
		return headers;
	},
});
const baseQueryWithAuth: BaseQueryFn = async (args, api, extraOptions) => {
	const token: string = getLocalStorage(STORAGE_CREDENTIAL_KEY);
	try {
		let query = await baseQuery(args, api, extraOptions);

		// Re-fetch accessToken in case it expired.
		if (query.error && (query.error as ObjectType).status) {
			const refreshTokenRequest = { method: 'POST', url: '/auth/refresh-token', body: { token } };
			const { data: tokenResponse } = await baseQuery(refreshTokenRequest, api, extraOptions);

			if (tokenResponse) {
				const { data: newAccessToken } = tokenResponse as ObjectType;
				Cookies.set('jwt', newAccessToken, { expires: ACCESS_TOKEN_LIFE });
				// Update the Authorization header for subsequent requests
				const updatedExtraOptions = {
					...extraOptions,
					headers: {
						...(extraOptions as ObjectType)?.headers,
						Authorization: `Bearer ${newAccessToken}`,
					},
				};
				// Retry the original request with the updated Authorization header
				query = await baseQuery(args, api, updatedExtraOptions);
			}
		}

		return query;
	} catch (error) {
		// Handle errors here
		throw error;
	}
};

// Define our single API slice object
export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithAuth,
	extractRehydrationInfo(action, { reducerPath }) {
		if (action.type === REHYDRATE) return action.payload[reducerPath];
	},
	tagTypes: ['Post'],
	endpoints: (builder) => ({
		getPosts: builder.query<any, void>({
			query: () => 'posts',
			providesTags: (result) => {
				if (!result) return [{ type: 'Post', id: 'LIST' }];

				const resultTags = result.map(({ id }: ObjectType) => ({ type: 'Post' as const, id }));
				return [...resultTags, { type: 'Post', id: 'LIST' }];
			},
			transformResponse: (response: ObjectType) => response.data,
		}),
		createPost: builder.mutation<any, any>({
			query: (body) => ({ url: 'posts', method: 'POST', body }),
			invalidatesTags: [{ type: 'Post', id: 'LIST' }],
		}),
		updatePost: builder.mutation<any, any>({
			query: ({ id, body }) => ({ url: `posts/${id}`, method: 'PATCH', body }),
			invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
		}),
		deletePost: builder.mutation({
			query: (id) => ({ url: `posts/${id}`, method: 'DELETE' }),
			invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
		}),
	}),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetPostsQuery, useDeletePostMutation, useCreatePostMutation, useUpdatePostMutation } = apiSlice;
