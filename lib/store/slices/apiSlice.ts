'use client';

import LogService from '@lib/backend/services/LogService';
import { STORAGE_CREDENTIAL_KEY } from '@lib/configs/constants';
import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { REHYDRATE } from 'redux-persist';

import { ACCESS_TOKEN_LIFE } from '@shared/commons/constants/encryption';
import { ObjectType } from '@shared/interfaces/base';
import { getLocalStorage } from '@shared/utils/dom';

import { postApis } from '../api/postApis';
import { projectApis } from '../api/projectApis';
import { taskApis } from '../api/taskApis';
import { userApis } from '../api/userApis';

const baseQuery: BaseQueryFn = fetchBaseQuery({
	baseUrl: '/api',
	prepareHeaders: (headers, { getState, endpoint }) => {
		const accessToken = Cookies.get('jwt');
		if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);

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
		LogService.log((error as Error).message);
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
	tagTypes: ['Post', 'User', 'Project', 'Task'],
	endpoints: (builder) => ({
		...postApis(builder),
		...projectApis(builder),
		...taskApis(builder),
		...userApis(builder),
	}),
});

export const {
	useGetPostsQuery,
	useGetPostQuery,
	useDeletePostMutation,
	useCreatePostMutation,
	useUpdatePostMutation,
	useGetProjectsQuery,
	useGetProjectQuery,
	useDeleteProjectMutation,
	useCreateProjectMutation,
	useUpdateProjectMutation,
	useGetTasksQuery,
	useGetTaskQuery,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
	useGetUserQuery,
	useGetUsersQuery,
} = apiSlice;
