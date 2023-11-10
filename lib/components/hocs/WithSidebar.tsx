import dynamic from 'next/dynamic';
import React, { PropsWithChildren } from 'react';

const Sidebar = dynamic(() => import('@lib/DashboardModule/Sidebar'), { ssr: false });

export default function WithSidebar({ children }: PropsWithChildren) {
	return (
		<div className="w-full h-screen overflow-hidden flex flex-nowrap">
			<div className="flex w-full relative">
				<Sidebar />
				<div className="grow flex flex-col">{children}</div>
			</div>
		</div>
	);
}
