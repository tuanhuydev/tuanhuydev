import SignIn from '@pages/auth/sign-in';
import { render, screen } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';

import WithProvider from '@frontend/components/hocs/WithProvider';
import store from '@frontend/store';

import { mockWindow } from './mocks/dom';

describe('Sign in page test suit', () => {
	beforeAll(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: mockWindow,
		});
	});

	it('Should render page', async () => {
		render(
			<WithProvider context={{ theme: 'light' }}>
				<ReduxProvider store={store}>
					<SignIn />
				</ReduxProvider>
			</WithProvider>
		);
		const pageElement = await screen.findByTestId('sign-in-page-testid');
		expect(pageElement).toBeInTheDocument();
	});

	it('Should contain email and password field', async () => {
		render(
			<WithProvider context={{ theme: 'light' }}>
				<ReduxProvider store={store}>
					<SignIn />
				</ReduxProvider>
			</WithProvider>
		);
		const emailPlacholder = await screen.queryByPlaceholderText('Email');
		const passwordPlaceholder = await screen.queryByPlaceholderText('Password');
		expect(emailPlacholder).toBeInTheDocument();
		expect(passwordPlaceholder).toBeInTheDocument();
	});
});
