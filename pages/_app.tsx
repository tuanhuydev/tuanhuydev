import '@frontend/styles/globals.scss';
import type { AppProps } from 'next/app';
import WithProvider from '@frontend/components/hocs/WithProvider';
import WithAntd from '@frontend/components/hocs/WithAntd';
import { ObjectType } from '@shared/interfaces/base';
import { notification } from 'antd';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@frontend/configs/store';

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

export default App;
