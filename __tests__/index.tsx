import { render, screen } from '@testing-library/react';
import Home from '@pages/index';
import WithProvider from '@frontend/components/hocs/WithProvider';

describe('Home page test suit', () => {
	beforeAll(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: jest.fn(), // Deprecated
				removeListener: jest.fn(), // Deprecated
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
	});
	it('page title renders', () => {
		render(
			<WithProvider context={{ theme: 'light' }}>
				<Home />
			</WithProvider>
		);

		const heading = screen.queryByText('tuanhuydev');
		expect(heading).toBeInTheDocument();
	});
});
