import { CloseCircleOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Popover, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useState } from 'react';
import { useDispatch } from 'react-redux';

import { EMPTY_OBJECT } from '@shared/configs/constants';

import Navbar from '@frontend/Dashboard/Navbar';
import Sidebar from '@frontend/Dashboard/Sidebar';
import { authActions } from '@frontend/configs/store/slices/authSlice';

export interface PageContainerProps extends PropsWithChildren {
	title: string;
}

export default function PageContainer({ title, children }: PageContainerProps) {
	// Hook
	const router = useRouter();
	const dispatch = useDispatch();

	// State
	const [open, setOpenUserMenu] = useState(false);
	const [sidebarOpen, setSidebarState] = useState(true);

	const signOut = () => {
		localStorage.clear();
		dispatch(authActions.setAuth(EMPTY_OBJECT));
		router.push('/auth/sign-in');
	};

	const toggleUserMenu = (value: boolean) => () => {
		if (!value) {
			setOpenUserMenu(!open);
			return;
		}
		setOpenUserMenu(value);
		signOut();
	};

	const toggleSidebar = (value: boolean) => {
		setSidebarState(value);
	};

	return (
		<div className="bg-slate-50 w-full h-screen lg:overflow-hidden flex flex-wrap lg:flex-nowrap">
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
						<div className="p-4 overflow-auto">{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
