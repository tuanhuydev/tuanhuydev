import { LeftOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { EMPTY_OBJECT } from '@lib/configs/constants';
import { authActions } from '@lib/store/slices/authSlice';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { Fragment, PropsWithChildren, ReactNode, memo, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

const Button = dynamic(() => import('antd/es/button'), { ssr: false });
const Popover = dynamic(() => import('antd/es/popover'), { ssr: false });

interface NavbarProps extends PropsWithChildren {
	title?: string;
	goBack?: boolean;
	startComponent?: ReactNode;
	endComponent?: ReactNode;
}

const Navbar = ({ title, goBack = false, startComponent = <Fragment />, endComponent = <Fragment /> }: NavbarProps) => {
	// Hook
	const router = useRouter();
	const dispatch = useDispatch();

	// State
	const [open, setOpenUserMenu] = useState(false);

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

	const renderStart = useMemo(() => {
		if (title)
			return (
				<div className="flex items-center gap-1">
					{goBack ? <Button type="text" onClick={() => router.back()} icon={<LeftOutlined />}></Button> : <Fragment />}
					<h1 className="my-auto text-xl font-bold capitalize">{title}</h1>
				</div>
			);
		return startComponent;
	}, [goBack, router, startComponent, title]);

	const renderEnd = useMemo(() => {
		return (
			<Popover
				placement="bottom"
				content={
					<ul className="block m-0 p-0 list-none">
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
		);
	}, [open, toggleUserMenu]);

	return (
		<div className="px-3 py-2 bg-white flex item-center justify-between">
			{renderStart}
			{renderEnd}
		</div>
	);
};

export default memo(Navbar);
