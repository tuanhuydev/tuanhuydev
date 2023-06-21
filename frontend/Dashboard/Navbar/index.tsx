import { Typography } from 'antd';
import React, { PropsWithChildren, ReactNode } from 'react';

const { Title } = Typography;

interface NavbarProps extends PropsWithChildren {
	startComponent?: ReactNode;
	endComponent?: ReactNode;
}

export default function Navbar({ startComponent, endComponent }: NavbarProps) {
	return (
		<div className="px-3 py-2 bg-white flex item-center justify-between border-b border-slate-100">
			{startComponent}
			{endComponent}
		</div>
	);
}
