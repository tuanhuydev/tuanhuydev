'use client';

import {
	AppstoreOutlined,
	ContainerOutlined,
	HomeOutlined,
	LeftCircleOutlined,
	ProjectOutlined,
	RightCircleOutlined,
	SettingOutlined,
	UserOutlined,
} from '@ant-design/icons';
import logoSrc from '@lib/assets/images/logo.svg';
import { EMPTY_STRING } from '@lib/configs/constants';
import { RootState } from '@lib/configs/types';
import { metaAction } from '@lib/store/slices/metaSlice';
import { Button } from 'antd';
import Image from 'next/image';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Group from './Group';
import Item from './Item';
import styles from './styles.module.scss';

const Sidebar = () => {
	const dispatch = useDispatch();

	const sidebarOpen = useSelector((state: RootState) => state.meta.sidebarOpen);

	const toggleSidebar = useCallback(() => dispatch(metaAction.setSidebarState(!sidebarOpen)), [dispatch, sidebarOpen]);

	const toggleIcon = sidebarOpen ? (
		<LeftCircleOutlined className="text-sm" />
	) : (
		<RightCircleOutlined className="text-sm" />
	);

	const renderRoutes = useMemo(() => {
		const routes = [
			{ label: 'Home', icon: <HomeOutlined />, path: '/dashboard/home' },
			{ label: 'Posts', icon: <ContainerOutlined />, path: '/dashboard/posts' },
			{
				label: 'Manage Projects',
				children: [
					{ label: 'Projects', icon: <AppstoreOutlined />, path: '/dashboard/projects' },
					{ label: 'Tasks', icon: <ProjectOutlined />, path: '/dashboard/tasks' },
				],
			},
			{ label: 'Accounts', icon: <UserOutlined />, path: '/dashboard/accounts' },
			{ label: 'Settings', icon: <SettingOutlined />, path: '/dashboard/settings' },
		];

		return routes.map((route: any) => {
			const { children = [] } = route;
			return children?.length ? <Group {...route} key={route.label} /> : <Item {...route} key={route.label} />;
		});
	}, []);

	const containerToggleStyles = sidebarOpen ? styles.open : EMPTY_STRING;

	return (
		<div className="relative p-2">
			<div className="h-14 bg-white truncate flex items-center justify-center">
				<Image src={logoSrc} width={32} height={32} alt="page logo" />
			</div>
			<Button
				shape="circle"
				className="!bg-white text-slate-400 text-center leading-none !absolute -right-4 top-1/2 z-20 drop-shadow-sm"
				type="text"
				onClick={toggleSidebar}
				icon={toggleIcon}
			/>
			<ul
				className={`${styles.container} ${containerToggleStyles} ease-in duration-150 bg-white h-full overflow-x-hidden list-none p-0 m-0`}>
				{renderRoutes}
			</ul>
		</div>
	);
};

export default Sidebar;
