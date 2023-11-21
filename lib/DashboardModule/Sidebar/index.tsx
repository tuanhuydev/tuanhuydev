'use client';

import {
	AppstoreOutlined,
	ContainerOutlined,
	HomeOutlined,
	LeftCircleOutlined,
	ProjectOutlined,
	RightCircleOutlined,
	UserOutlined,
} from '@ant-design/icons';
import logoSrc from '@lib/assets/images/logo.svg';
import Loader from '@lib/components/commons/Loader';
import { EMPTY_STRING } from '@lib/configs/constants';
import { RootState } from '@lib/configs/types';
import { currentUserSelector } from '@lib/store/slices/authSlice';
import { metaAction } from '@lib/store/slices/metaSlice';
import { Button } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.scss';

const Group = dynamic(() => import('./Group'), { ssr: false, loading: () => <Loader /> });
const Item = dynamic(() => import('./Item'), { ssr: false, loading: () => <Loader /> });

const Sidebar = () => {
	const dispatch = useDispatch();

	const sidebarOpen = useSelector((state: RootState) => state.meta.sidebarOpen);
	const currentUser = useSelector(currentUserSelector);
	const { resources = [] } = currentUser || {};

	const toggleSidebar = useCallback(() => dispatch(metaAction.setSidebarState(!sidebarOpen)), [dispatch, sidebarOpen]);

	const toggleIcon = sidebarOpen ? (
		<LeftCircleOutlined className="text-sm" />
	) : (
		<RightCircleOutlined className="text-sm" />
	);

	const renderRoutes = useMemo(() => {
		const routes: Array<any> = [{ label: 'Home', icon: <HomeOutlined />, path: '/dashboard/home' }];
		resources.forEach((resource: any) => {
			switch (resource.name) {
				case 'Posts':
					routes.push({ label: 'Posts', icon: <ContainerOutlined />, path: '/dashboard/posts' });
					break;
				case 'Projects':
					routes.push({
						label: 'Manage Projects',
						children: [
							{ label: 'Projects', icon: <AppstoreOutlined />, path: '/dashboard/projects' },
							{ label: 'Tasks', icon: <ProjectOutlined />, path: '/dashboard/tasks' },
						],
					});
					break;
				case 'Users':
					routes.push({ label: 'Users', icon: <UserOutlined />, path: '/dashboard/users' });
					break;
			}
		});
		// routes.push({ label: 'Settings', icon: <SettingOutlined />, path: '/dashboard/settings' });
		return routes.map((route: any) => {
			const { children = [] } = route;
			return children?.length ? <Group {...route} key={route.label} /> : <Item {...route} key={route.label} />;
		});
	}, [resources]);

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
