import DashboardCreatePosts from '@pages/dashboard/posts/create';
import DashboardPosts from '@pages/dashboard/posts/index';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';

import WithProvider from '@frontend/components/hocs/WithProvider';
import store from '@frontend/configs/store';

import { mockWindow } from '../mocks/dom';

describe('Dashboard posts page test suit', () => {
	beforeAll(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: mockWindow,
		});
	});
	it('Should render posts page', async () => {
		// Arrange
		const useRouter = jest.spyOn(require('next/router'), 'useRouter');
		useRouter.mockImplementation(() => ({ push: jest.fn() }));

		// Act
		render(
			<WithProvider context={{ theme: 'light' }}>
				<ReduxProvider store={store}>
					<DashboardPosts />
				</ReduxProvider>
			</WithProvider>
		);

		// Assert
		const pageSkeleton = await screen.findByTestId('skeleton-testid');
		expect(pageSkeleton).toBeInTheDocument();

		await waitFor(() => {
			setTimeout(async () => {
				const pageElement = await screen.findByTestId('dashboard-posts-page-testid');
				expect(pageElement).toBeInTheDocument();
			}, 500);
		});
	});
	it('Should render create post page', async () => {
		// Arrange
		const useRouter = jest.spyOn(require('next/router'), 'useRouter');
		useRouter.mockImplementation(() => ({ push: jest.fn() }));

		// Act
		render(
			<WithProvider context={{ theme: 'light' }}>
				<ReduxProvider store={store}>
					<DashboardCreatePosts />
				</ReduxProvider>
			</WithProvider>
		);

		// Assert
		await waitFor(() => {
			setTimeout(async () => {
				const pageElement = await screen.findByTestId('post-form-testid');
				expect(pageElement).toBeInTheDocument();
			}, 500);
		});
	});
});
