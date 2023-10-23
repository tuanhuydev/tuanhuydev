import Sidebar from 'lib/DashboardModule/Sidebar';
import React, { PropsWithChildren } from 'react';

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
