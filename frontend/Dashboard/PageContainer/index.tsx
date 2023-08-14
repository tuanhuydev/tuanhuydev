import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EMPTY_OBJECT } from '@shared/configs/constants';

import Navbar from '@frontend/Dashboard/Navbar';
import Sidebar from '@frontend/Dashboard/Sidebar';
import { RootState } from '@frontend/configs/types';
import { authActions } from '@frontend/store/slices/authSlice';
import { metaAction } from '@frontend/store/slices/metaSlice';

export interface PageContainerProps extends PropsWithChildren {
	title: string;
}

export default function PageContainer({ title, children }: PageContainerProps) {
	// Hook
	const router = useRouter();
	const dispatch = useDispatch();

	// State
	const [open, setOpenUserMenu] = useState(false);

	// Selector
	const sidebarOpen = useSelector((state: RootState) => state.meta.sidebarOpen);

	const signOut = useCallback(() => {
		localStorage.clear();
		dispatch(authActions.setAuth(EMPTY_OBJECT));
		router.replace('/auth/sign-in');
	}, [dispatch, router]);

	const toggleUserMenu = useCallback(
		(value: boolean) => () => {
			if (!value) {
				setOpenUserMenu(!open);
				return;
			}
			setOpenUserMenu(value);
			signOut();
		},
		[open, signOut]
	);

	const toggleSidebar = useCallback(
		(value: boolean) => {
			dispatch(metaAction.setSidebarState(!sidebarOpen));
		},
		[dispatch, sidebarOpen]
	);

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>

			<div className="bg-slate-50 w-full h-screen overflow-hidden flex flex-nowrap">
				<div className="flex w-full relative">
					<Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
					<div className="grow flex flex-col">
						<Navbar
							startComponent={<h1 className="mb-0 text-2xl font-bold capitalize">{title}</h1>}
							endComponent={
								<div className="flex">
									<Popover
										placement="bottom"
										content={
											<ul className="block">
												<li className="mb-1">
													<h4 className="text-sm font-bold truncate mb-0">Huy Nguyen Tuan</h4>
												</li>
												<li className="mb-2">@tuanhuydev</li>
												<li className="mb-2">
													<a onClick={toggleUserMenu(true)}>
														<LogoutOutlined className="mr-2" />
														Sign out
													</a>
												</li>
											</ul>
										}
										overlayInnerStyle={{ width: '10rem' }}
										trigger="click"
										open={open}
										onOpenChange={toggleUserMenu(false)}>
										<Button shape="circle" type="text" size="large" icon={<UserOutlined />} />
									</Popover>
								</div>
							}
						/>
						<div className="grow bg-white overflow-auto">
							<div className="p-4 h-full overflow-auto">{children}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
