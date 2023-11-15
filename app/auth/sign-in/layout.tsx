'use client';

import theme from '@lib/configs/theme';
import { authActions } from '@lib/store/slices/authSlice';
import { User } from '@prisma/client';
import { ConfigProvider } from 'antd';
import store from 'lib/store';
import { PropsWithChildren, useCallback, useEffect } from 'react';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';

export default function SignInLayout({ children }: PropsWithChildren) {
	return (
		<ConfigProvider theme={theme}>
			<ReduxProvider store={store}>{children}</ReduxProvider>
		</ConfigProvider>
	);
}
