'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input } from 'antd';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BaseError from '@shared/commons/errors/BaseError';
import UnauthorizedError from '@shared/commons/errors/UnauthorizedError';
import { EMPTY_STRING, STORAGE_CREDENTIAL_KEY } from '@shared/configs/constants';
import { ObjectType } from '@shared/interfaces/base';
import { getLocalStorage, setLocalStorage } from '@shared/utils/dom';

import { AppContext } from '@frontend/components/hocs/WithProvider';
import apiClient from '@frontend/configs/httpClient';
import { authActions } from '@frontend/configs/store/slices/authSlice';
import { RootState } from '@frontend/configs/types';

const INITIAL_SIGN_IN_FORM = {
	email: '',
	password: '',
};

export default function SignIn() {
	// Hooks
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const { context } = useContext(AppContext);
	const router = useRouter();

	// Selectors
	const auth = useSelector((state: RootState) => state.auth);

	// State
	const [submiting, setSubmitState] = useState(false);

	const syncAuth = ({ token = EMPTY_STRING, refreshToken = EMPTY_STRING }: any) => {
		if (!token || !refreshToken) throw new UnauthorizedError();
		const credential = { token, refreshToken };

		dispatch(authActions.setAuth(credential));
		setLocalStorage(STORAGE_CREDENTIAL_KEY, JSON.stringify(credential));
	};

	const handleAuth = async (body: { email: string; password: string }) => {
		const { data }: AxiosResponse = await apiClient.post('/auth/sign-in', body);
		syncAuth(data);
	};

	const submit = async (formData: any) => {
		setSubmitState(true);
		try {
			await handleAuth(formData);
			await router.push('/dashboard');
		} catch (error) {
			context.toastApi.error({ message: (error as BaseError).message });
			form.resetFields();
		} finally {
			setSubmitState(false);
		}
	};

	// TODO: Write custom hook
	const isAuthenticatedByStore = useCallback(
		(): boolean => auth.token && auth.refreshToken,
		[auth.refreshToken, auth.token]
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
		if (isAuthenticated) {
			router.push('/dashboard/home');
		}
	}, [isAuthenticatedByStorage, isAuthenticatedByStore, router]);

	return (
		<div className="bg-white flex items-center justify-center w-screen h-screen" data-testid="sign-in-page-testid">
			<Form
				form={form}
				initialValues={INITIAL_SIGN_IN_FORM}
				onFinish={submit}
				className="form h-fit w-96 drop-shadow-md bg-white p-3">
				<h1 className="font-sans text-2xl font-bold mb-4">Sign In</h1>
				<Form.Item name="email" className="mb-4">
					<Input
						size="large"
						placeholder="Email"
						disabled={submiting}
						prefix={<UserOutlined />}
						type="email"
						required
					/>
				</Form.Item>
				<Form.Item name="password" className="mb-5">
					<Input
						size="large"
						prefix={<LockOutlined />}
						disabled={submiting}
						placeholder="Password"
						type="password"
						required
					/>
				</Form.Item>

				<Button
					type="primary"
					size="large"
					className="w-full bg-primary capitalize border-transparent shadow-none"
					loading={submiting}
					disabled={submiting}
					htmlType="submit">
					submit
				</Button>
				<Divider className="my-3" />
				<Button size="large" disabled={submiting} className="w-full capitalize mr-3" htmlType="submit">
					clear
				</Button>
			</Form>
		</div>
	);
}
