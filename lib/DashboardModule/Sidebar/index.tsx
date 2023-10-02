'use client';

import {
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
import { Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { memo, useCallback, useMemo } from 'react';

import styles from './styles.module.scss';

const Sidebar = ({ open, onToggle }: any) => {
	// Hooks
	const pathName = usePathname();
	const linkContainerStyles = open ? styles.open : EMPTY_STRING;

	const toggleSidebar = useCallback(() => onToggle(!open), [onToggle, open]);

	const toggleIcon = useMemo(() => {
		const iconStyle = { fontSize: '1.125rem' };
		return open ? <LeftCircleOutlined style={iconStyle} /> : <RightCircleOutlined style={iconStyle} />;
	}, [open]);

	const renderRoutes = useMemo(() => {
		const routes = [
			{ label: 'Home', icon: <HomeOutlined />, path: '/dashboard/home' },
			{ label: 'Posts', icon: <ContainerOutlined />, path: '/dashboard/posts' },
			{ label: 'Tasks', icon: <ProjectOutlined />, path: '/dashboard/tasks' },
			{ label: 'Accounts', icon: <UserOutlined />, path: '/dashboard/accounts' },
			{ label: 'Settings', icon: <SettingOutlined />, path: '/dashboard/settings' },
		];

		return routes.map(({ label, icon, path }) => {
			const activeClass = pathName && (pathName as string).startsWith(path) ? styles.active : EMPTY_STRING;
			return (
				<Link href={path} key={path}>
					<li
						className={`ease-in duration-200 rounded-sm mb-1 text-slate-600 cursor-pointer py-2 px-3 hover:bg-primary hover:text-white ${activeClass}`}>
						<div className="capitalize flex items-center">
							<span className="mr-4">{icon}</span>
							{label}
						</div>
					</li>
				</Link>
			);
		});
	}, [pathName]);

	return (
		<div className="relative">
			<div className="absolute -right-4 top-1/2 z-20 drop-shadow-md">
				<Button
					shape="circle"
					className="bg-white text-slate-400 flex items-center justify-center"
					type="text"
					onClick={toggleSidebar}
					icon={toggleIcon}
				/>
			</div>
			<div className="h-14 bg-white truncate flex items-center justify-center">
				<Image src={logoSrc} width={32} height={32} alt="page logo" />
			</div>
			<ul
				className={`${styles.container} ${linkContainerStyles} ease-in duration-150 bg-white h-full border-r border-slate-100 relative overflow-x-hidden p-1`}>
				{renderRoutes}
			</ul>
		</div>
	);
};

export default memo(Sidebar);
