'use client';

import { STORAGE_CREDENTIAL_KEY } from '@lib/configs/constants';
import { Skeleton } from 'antd';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { getLocalStorage } from '@shared/utils/dom';

export default function WithAuth(WrappedComponent: React.FC) {
	const AuthenticatedComponent = (props: JSX.IntrinsicAttributes) => {
		const [authenticated, setAuthenticated] = useState(false);
		// Hooks
		const router = useRouter();

		useEffect(() => {
			const missStorageToken = !getLocalStorage(STORAGE_CREDENTIAL_KEY) as boolean;
			const missCookieToken = !Cookies.get('jwt');
			const unAuthenticated = missStorageToken && missCookieToken;

			if (unAuthenticated) router.replace('/auth/sign-in');
			setAuthenticated(!unAuthenticated);
		}, [router]);

		if (authenticated) return <WrappedComponent {...props} />;
		return <Skeleton data-testid="skeleton-testid" />;
	};

	return AuthenticatedComponent;
}
