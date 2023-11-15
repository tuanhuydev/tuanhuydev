import { BASE_URL, STORAGE_CREDENTIAL_KEY } from '@lib/configs/constants';
import { clearLocalStorage, getLocalStorage, setLocalStorage } from '@lib/shared/utils/dom';
import { authActions } from '@lib/store/slices/authSlice';
import { User } from '@prisma/client';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { Fragment, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

type UserWithPermission = User & { permissionId: number };

const Sidebar = dynamic(() => import('@lib/DashboardModule/Sidebar'), { ssr: false });

export default function WithAuth({ children }: PropsWithChildren) {
	const [validated, setValidate] = useState(false);
	const storageUser: UserWithPermission = getLocalStorage('currentUser');

	const hasCookie = !!Cookies.get('jwt');
	const hasCredential = !!getLocalStorage(STORAGE_CREDENTIAL_KEY) as boolean;
	const hasStorageUser = !!storageUser;

	const router = useRouter();
	const dispatch = useDispatch();

	const clearAuth = useCallback(() => {
		clearLocalStorage();
		router.replace('/auth/sign-in');
	}, [router]);

	const fetchResource = useCallback(async (permissionId: number) => {
		const response: any = await fetch(`${BASE_URL}/api/resources/permission/${permissionId}`, {
			headers: { authorization: `Bearer ${Cookies.get('jwt')}` },
		});
		if (!response.ok) throw new Error('Resources not found');

		const { data: resources = [] } = await response.json();
		return resources;
	}, []);

	const init = useCallback(async () => {
		try {
			if (!storageUser || !storageUser.permissionId) throw new Error('Credential not found');

			const resources = await fetchResource(storageUser.permissionId);
			const userWithResources = { ...storageUser, resources };

			dispatch(authActions.setCurrentUser(userWithResources));
			setLocalStorage('currentUser', JSON.stringify(userWithResources));

			setValidate(hasCookie && hasCredential && hasStorageUser);
		} catch (error) {
			clearAuth();
		}
	}, [clearAuth, dispatch, fetchResource, hasCookie, hasCredential, hasStorageUser, storageUser]);

	useEffect(() => {
		init();
	}, [init]);

	return validated ? (
		<div className="w-full h-screen overflow-hidden flex flex-nowrap">
			<div className="flex w-full relative">
				<Sidebar />
				<div className="grow flex flex-col">{children}</div>
			</div>
		</div>
	) : (
		<Fragment />
	);
}
