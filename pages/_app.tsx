import { notification } from 'antd';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Provider as ReduxProvider } from 'react-redux';

import { ObjectType } from '@shared/interfaces/base';

import WithAntd from '@frontend/components/hocs/WithAntd';
import WithProvider from '@frontend/components/hocs/WithProvider';
import store from '@frontend/configs/store';
import '@frontend/styles/globals.scss';

function App({ Component, pageProps }: AppProps) {
	const [api, contextHolder] = notification.useNotification();

	const context: ObjectType = {
		theme: 'light',
		playSound: true,
		toastApi: api,
	};
	return (
		<WithProvider context={context}>
			<WithAntd>
				<ReduxProvider store={store}>
					<Component {...pageProps} />
				</ReduxProvider>
				{contextHolder}
			</WithAntd>
		</WithProvider>
	);
}

export default appWithTranslation(App);
