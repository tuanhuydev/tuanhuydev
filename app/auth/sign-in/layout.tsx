'use client';

import store from 'lib/store';
import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

export default function SignInLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body>
				<ReduxProvider store={store}>{children}</ReduxProvider>
			</body>
		</html>
	);
}
