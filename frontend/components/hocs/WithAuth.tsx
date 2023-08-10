import { Skeleton } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STORAGE_CREDENTIAL_KEY } from '@shared/configs/constants';
import { ObjectType } from '@shared/interfaces/base';
import { getLocalStorage } from '@shared/utils/dom';

import { AppDispatch, RootState } from '@frontend/configs/types';
import { authActions } from '@frontend/store/slices/authSlice';

export default function WithAuth(WrappedComponent: React.FC) {
	const AuthenticatedComponent = (props: JSX.IntrinsicAttributes) => {
		// Hooks
		const router = useRouter();
		const dispatch: AppDispatch = useDispatch();

		// Selectors
		const auth = useSelector((state: RootState) => state.auth);

		// State
		const [isAuthenticated, setAuthenticate] = useState<Boolean>(false);

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
				setAuthenticate(isAuthenticated);
			} else {
				router.push('/auth/sign-in');
			}
		}, [isAuthenticatedByStorage, isAuthenticatedByStore, router]);

		if (isAuthenticated) {
			return <WrappedComponent {...props} />;
		}
		return (
			<div data-testid="skeleton-testid">
				<Skeleton />;
			</div>
		);
	};
	return AuthenticatedComponent;
}
