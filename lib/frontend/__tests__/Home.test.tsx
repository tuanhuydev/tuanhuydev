import { render, screen } from '@testing-library/react';

import Footer from '@frontend/Home/Footer';

import Hero from '../Home/Hero';
import Navbar from '../Home/Navbar';
import WithProvider from '../components/hocs/WithProvider';

describe('Home Page test suit', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should render navbar', () => {
		render(
			<WithProvider>
				<Navbar />
			</WithProvider>
		);
		const headerElement = document.querySelector('header');
		expect(headerElement).toBeInTheDocument();
	});

	it('Should render hero section', async () => {
		render(<Hero />);
		const heroElement = await screen.findByTestId('homepage-about-me');
		expect(heroElement).toBeInTheDocument();
	});

	it('Should render footer', () => {
		render(<Footer />);
		const footerElement = document.querySelector('footer');
		expect(footerElement).toBeInTheDocument();
	});
});
