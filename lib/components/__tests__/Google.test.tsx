import GoogleAdsense from '@lib/components/google/GoogleAdsense';
import GoogleAnalytic from '@lib/components/google/GoogleAnalytic';
import GoogleTag from '@lib/components/google/GoogleTag';
import { render } from '@testing-library/react';
import React from 'react';

jest.mock('next/script', () => ({
	__esModule: true,
	default: jest.fn((props) => <script {...props}></script>),
}));

jest.mock('@lib/configs/constants', () => ({
	GOOGLE_ADSENSE: 'your_adsense_id',
	GOOGLE_TAG: 'your_google_tag',
	NODE_ENV: 'production',
}));

describe('GoogleAdsense component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should render Google Adsense component in production environment', async () => {
		render(<GoogleAdsense />);
		const scriptElement = document.querySelector('script');
		expect(scriptElement).toBeInTheDocument();
		expect(scriptElement).toHaveAttribute(
			'src',
			'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-your_adsense_id'
		);
		expect(scriptElement).toHaveAttribute('crossorigin', 'anonymous');
	});

	it('Should render Google Tag component in production environment', async () => {
		render(<GoogleTag />);
		const scriptElement = document.querySelector('script');
		expect(scriptElement).toBeInTheDocument();
		expect(scriptElement).toHaveAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=your_google_tag');
		expect(scriptElement).toHaveAttribute('strategy', 'afterInteractive');
	});

	it('Should render Google Analytic component in production environment', async () => {
		render(<GoogleAnalytic />);
		const scriptElement = document.querySelector('script');
		expect(scriptElement).toBeInTheDocument();
		expect(scriptElement).toHaveAttribute('id', 'google-analytics');
		expect(scriptElement).toHaveAttribute('strategy', 'afterInteractive');
	});
});
