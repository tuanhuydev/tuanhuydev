import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { EMPTY_STRING } from '@lib/configs/constants';
import { RootState } from '@lib/configs/types';
import { isPathActive } from '@lib/shared/utils/helper';
import { Tooltip } from 'antd';
import { usePathname } from 'next/navigation';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import Item, { ItemProps } from './Item';
import styles from './styles.module.scss';

export interface GroupProps extends ItemProps {
	children: ItemProps[];
}

export default function Group({ label, icon, children }: GroupProps) {
	const sidebarOpen = useSelector((state: RootState) => state.meta.sidebarOpen);
	const pathName = usePathname();

	const [open, setOpen] = useState<boolean>(false);

	const toggleGroup = () => setOpen((prevOpen: boolean) => !prevOpen);

	const isGroupActive = children.some(({ path }: ItemProps) => isPathActive(pathName, path));
	const activeClass = isGroupActive ? styles.active : EMPTY_STRING;
	const childClass = sidebarOpen ? 'ml-2 mt-2' : EMPTY_STRING;

	useEffect(() => {
		if (!sidebarOpen) setOpen(false);
	}, [sidebarOpen]);
	const element = (
		<div
			className={`capitalize flex rounded-sm items-center min-w-0 py-2 px-3 mb-3 hover:bg-primary hover:text-white ${activeClass}`}>
			{icon ? <span className="mr-4">{icon}</span> : <Fragment />}
			<span className="truncate font-medium">{label}</span>
			{open ? (
				<UpOutlined className="text-base ml-auto font-bold" />
			) : (
				<DownOutlined className="text-base ml-auto font-bold" />
			)}
		</div>
	);
	return (
		<li className="ease-in duration-200  mb-1 text-slate-600 cursor-pointer" onClick={toggleGroup}>
			{sidebarOpen ? (
				element
			) : (
				<Tooltip title={label} placement="right">
					{element}
				</Tooltip>
			)}
			{open && (
				<ul className={`list-none p-0 ${childClass}`}>
					{children.map((childRoute: ItemProps) => (
						<Item key={childRoute.path} {...childRoute} />
					))}
				</ul>
			)}
		</li>
	);
}
