import {
	ContainerOutlined,
	HomeOutlined,
	LeftCircleOutlined,
	ProjectOutlined,
	RightCircleOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo, useCallback, useMemo } from 'react';

import { EMPTY_STRING } from '@shared/configs/constants';

import logoSrc from '@frontend/assets/images/logo.svg';

import styles from './styles.module.scss';

const Sidebar = ({ open, onToggle }: any) => {
	// Hooks
	const router = useRouter();

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
		];
		return routes.map(({ label, icon, path }) => {
			const activeClass =
				typeof router.pathname === 'string' && (router.pathname as string).startsWith(path) ? styles.active : '';
			return (
				<Link href={path} key={path}>
					<li className={`ease-in duration-200 rounded-sm mb-1 ${styles.navlink} ${activeClass}`}>
						<div className="capitalize flex items-center">
							<span className="mr-4">{icon}</span>
							{label}
						</div>
					</li>
				</Link>
			);
		});
	}, [router.pathname]);
	const linkContainerOpenStyles = open ? styles.open : EMPTY_STRING;

	return (
		<div className="relative">
			<div className="absolute -right-4 top-1/2 z-20">
				<Button
					shape="circle"
					className="bg-white text-slate-400"
					type="text"
					onClick={toggleSidebar}
					icon={toggleIcon}
				/>
			</div>
			<div className="h-14 bg-white truncate flex items-center justify-center">
				<Image src={logoSrc} width={32} height={32} alt="page logo" />
			</div>
			<ul
				className={`${styles.linkContainer} ${linkContainerOpenStyles} ease-in bg-white h-full border-r border-slate-100 relative overflow-x-hidden p-1`}>
				{renderRoutes}
			</ul>
		</div>
	);
};

export default memo(Sidebar);
