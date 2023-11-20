'use client';

import { DynamicFormConfig } from '@lib/components/commons/Form/DynamicForm';
import Loader from '@lib/components/commons/Loader';
import apiClient from '@lib/configs/apiClient';
import { STORAGE_CREDENTIAL_KEY } from '@lib/configs/constants';
import NotFoundError from '@lib/shared/commons/errors/NotFoundError';
import { App } from 'antd';
import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';

import BaseError from '@shared/commons/errors/BaseError';
import UnauthorizedError from '@shared/commons/errors/UnauthorizedError';
import { ObjectType } from '@shared/interfaces/base';
import { getLocalStorage, setLocalStorage } from '@shared/utils/dom';

const DynamicForm = dynamic(() => import('@lib/components/commons/Form/DynamicForm'), {
	ssr: false,
	loading: () => <Loader />,
});
const WithAnimation = dynamic(() => import('@lib/components/hocs/WithAnimation'), {
	ssr: false,
	loading: () => <Loader />,
});

// TODO: Move this one to API.
const signInFormConfig: DynamicFormConfig = {
	fields: [
		{
			name: 'email',
			type: 'email',
			options: {
				size: 'large',
				placeholder: 'Email',
			},
			validate: {
				required: true,
			},
		},
		{
			name: 'password',
			type: 'password',
			options: {
				size: 'large',
				placeholder: 'Password',
			},
			validate: {
				required: true,
			},
		},
	],
};

export default function SignIn() {
	// Hooks
	const router = useRouter();
	const { notification } = App.useApp();

	const syncAuth = (credential: ObjectType) => {
		if (!credential) throw new UnauthorizedError();
		Cookies.set('jwt', credential.accessToken);
		setLocalStorage(STORAGE_CREDENTIAL_KEY, credential.refreshToken);
	};

	const getCurrentUser = async (userId: string) => {
		const {
			data: { data: currentUser = {} },
		}: AxiosResponse = await apiClient.get(`/users/${userId}`);
		if (!currentUser) throw new NotFoundError('User not found');

		localStorage.setItem('currentUser', JSON.stringify(currentUser));
	};

	const submit = async (formData: ObjectType) => {
		try {
			const { data: res = {} }: AxiosResponse = await apiClient.post('/auth/sign-in', formData);
			if (!res) throw new UnauthorizedError('Invalid sign in');

			const { data: credential } = res;
			if (credential) {
				syncAuth(credential);
				if (credential?.userId) await getCurrentUser(credential?.userId);
			}
			router.push('/dashboard', {});
		} catch (error) {
			notification.error({ message: (error as BaseError).message });
		}
	};

	const isAuthenticatedByStorage = useCallback(() => {
		const credential: ObjectType | null = getLocalStorage(STORAGE_CREDENTIAL_KEY);
		return !!credential;
	}, []);

	useEffect(() => {
		const isAuthenticated: boolean = isAuthenticatedByStorage();
		if (isAuthenticated) router.push('/dashboard/home');
	}, [isAuthenticatedByStorage, router]);

	return (
		<WithAnimation>
			<div className="bg-white flex items-center justify-center w-screen h-screen" data-testid="sign-in-page-testid">
				<div className="h-fit w-96 drop-shadow-md bg-white px-3 pt-3 pb-5">
					<h1 className="font-sans text-2xl font-bold my-3">Sign In</h1>
					<DynamicForm
						config={signInFormConfig}
						onSubmit={submit}
						submitProps={{ size: 'large', className: 'w-full' }}
					/>
				</div>
			</div>
		</WithAnimation>
	);
}
