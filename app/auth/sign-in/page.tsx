'use client';

import DynamicForm, { DynamicFormConfig } from '@lib/components/commons/Form/DynamicForm';
import WithAnimation from '@lib/components/hocs/WithAnimation';
import { STORAGE_CREDENTIAL_KEY } from '@lib/configs/constants';
import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { AppContext } from 'lib/components/hocs/WithProvider';
import apiClient from 'lib/configs/apiClient';
import { RootState } from 'lib/configs/types';
import { authActions } from 'lib/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BaseError from '@shared/commons/errors/BaseError';
import UnauthorizedError from '@shared/commons/errors/UnauthorizedError';
import { ObjectType } from '@shared/interfaces/base';
import { getLocalStorage, setLocalStorage } from '@shared/utils/dom';

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

export default memo(function SignIn() {
	// Hooks
	const dispatch = useDispatch();
	const { context } = useContext(AppContext);
	const router = useRouter();

	// Selectors
	const auth = useSelector((state: RootState) => state.auth);

	const syncAuth = (credential: ObjectType) => {
		if (!credential) throw new UnauthorizedError();
		Cookies.set('jwt', credential.accessToken);
		setLocalStorage(STORAGE_CREDENTIAL_KEY, credential.refreshToken);
	};

	const submit = async (formData: ObjectType) => {
		try {
			const { data: res }: AxiosResponse = await apiClient.post('/auth/sign-in', formData);
			if (!res) throw new UnauthorizedError('Invalid sign in');

			syncAuth(res.data);
			router.push('/dashboard');
		} catch (error) {
			context.notify.error({ message: (error as BaseError).message });
		}
	};

	// TODO: Write custom hook
	const isAuthenticatedByStore = useCallback(
		(): boolean => auth.accessToken && auth.refreshToken,
		[auth.refreshToken, auth.accessToken]
	);

	const syncToStore = useCallback(
		(credential: any) => {
			dispatch(authActions.setAuth(credential));
		},
		[dispatch]
	);

	const isAuthenticatedByStorage = useCallback(() => {
		const credential: ObjectType | null = getLocalStorage(STORAGE_CREDENTIAL_KEY);
		if (credential) syncToStore(credential);
		return !!credential;
	}, [syncToStore]);

	useEffect(() => {
		const isAuthenticated: boolean = isAuthenticatedByStore() || isAuthenticatedByStorage();
		if (isAuthenticated) router.push('/dashboard/home');
	}, [isAuthenticatedByStorage, isAuthenticatedByStore, router]);

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
});
