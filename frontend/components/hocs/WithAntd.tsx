import { ConfigProvider } from 'antd';
import React, { PropsWithChildren } from 'react';
import theme from '@frontend/configs/theme';

export default function WithAntd(props: PropsWithChildren) {
	return <ConfigProvider theme={theme}>{props.children}</ConfigProvider>;
}
