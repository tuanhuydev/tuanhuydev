'use client';

import { STORAGE_CREDENTIAL_KEY } from '@lib/configs/constants';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { getLocalStorage } from '@shared/utils/dom';

const Loader = dynamic(() => import('../commons/Loader'));

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
		return <Loader />;
	};

	return AuthenticatedComponent;
}
