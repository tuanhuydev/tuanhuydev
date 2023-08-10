'use client';

import { notification } from 'antd';
import { AnimatePresence } from 'framer-motion';
import { NextPage } from 'next';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Router } from 'next/router';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { ObjectType } from '@shared/interfaces/base';

import Loader from '@frontend/components/commons/Loader';
import WithAntd from '@frontend/components/hocs/WithAntd';
import WithProvider from '@frontend/components/hocs/WithProvider';
import store from '@frontend/configs/store';
import '@frontend/styles/globals.scss';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
	// Hooks
	const [api, contextHolder] = notification.useNotification();

	// State
	const [loading, setLoading] = useState(false);

	const context: ObjectType = {
		theme: 'light',
		playSound: true,
		toastApi: api,
	};

	const start = () => setLoading(true);
	const end = () => setLoading(false);

	useEffect(() => {
		Router.events.on('routeChangeStart', start);
		Router.events.on('routeChangeComplete', end);
		Router.events.on('routeChangeError', end);
		return () => {
			Router.events.off('routeChangeStart', start);
			Router.events.off('routeChangeComplete', end);
			Router.events.off('routeChangeError', end);
		};
	}, []);

	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<WithProvider context={context}>
			<WithAntd>
				<ReduxProvider store={store}>
					<AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
						{loading ? <Loader /> : getLayout(<Component {...pageProps} />)}
					</AnimatePresence>
				</ReduxProvider>
				{contextHolder}
			</WithAntd>
		</WithProvider>
	);
}

export default appWithTranslation(App);
