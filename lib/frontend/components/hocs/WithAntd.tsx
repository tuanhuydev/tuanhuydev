'use client';

import { ConfigProvider } from 'antd';
import theme from 'lib/frontend/configs/theme';
import React, { PropsWithChildren } from 'react';

export default function WithAntd(props: PropsWithChildren) {
	const customConfig = {
		button: {
			style: {
				className: 'bg-red-500',
				boxShadow: 'none',
			},
		},
	};
	return (
		<ConfigProvider theme={theme} {...customConfig}>
			{props.children}
		</ConfigProvider>
	);
}
