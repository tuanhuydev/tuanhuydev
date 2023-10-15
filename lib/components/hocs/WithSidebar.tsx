'use client';

import Sidebar from 'lib/DashboardModule/Sidebar';
import { RootState } from 'lib/configs/types';
import { metaAction } from 'lib/store/slices/metaSlice';
import React, { PropsWithChildren, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function WithSidebar({ children }: PropsWithChildren) {
	// Hook
	const dispatch = useDispatch();

	// Selector
	const sidebarOpen = useSelector((state: RootState) => state.meta.sidebarOpen);

	const toggleSidebar = useCallback(
		(value: boolean) => {
			dispatch(metaAction.setSidebarState(!sidebarOpen));
		},
		[dispatch, sidebarOpen]
	);

	return (
		<div className="bg-slate-50 w-full h-screen overflow-hidden flex flex-nowrap">
			<div className="flex w-full relative">
				<Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
				<div className="grow">{children}</div>
			</div>
		</div>
	);
}
