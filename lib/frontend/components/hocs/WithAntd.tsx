'use client';

import { ConfigProvider } from 'antd';
import React, { PropsWithChildren } from 'react';

import theme from '@frontend/configs/theme';

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
