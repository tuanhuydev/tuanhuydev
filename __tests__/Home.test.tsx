import Home from '@pages/index';
import { render, screen } from '@testing-library/react';

import WithProvider from '@frontend/components/hocs/WithProvider';

import { mockWindow } from './mocks/dom';

describe('Home page test suit', () => {
	beforeAll(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: mockWindow,
		});
	});

	it('Should render', async () => {
		render(
			<WithProvider context={{ theme: 'light' }}>
				<Home />
			</WithProvider>
		);
		const homePageElement = await screen.findByTestId('homepage-testid');
		expect(homePageElement).toBeInTheDocument();
	});

	it('Should render about me section', async () => {
		render(
			<WithProvider context={{ theme: 'light' }}>
				<Home />
			</WithProvider>
		);
		const aboutMeElement = await screen.findByTestId('homepage-about-me');
		expect(aboutMeElement).toBeInTheDocument();
	});

	it('Should render contact section', async () => {
		render(
			<WithProvider context={{ theme: 'light' }}>
				<Home />
			</WithProvider>
		);
		const contactElement = await screen.findByTestId('homepage-contact-testid');
		expect(contactElement).toBeInTheDocument();
	});
});
