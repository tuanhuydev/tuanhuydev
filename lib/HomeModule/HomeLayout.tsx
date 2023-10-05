'use client';

import Footer from '@lib/HomeModule/Footer';
import Navbar from '@lib/HomeModule/Navbar';
import { AppContext } from '@lib/components/hocs/WithProvider';
import { STORAGE_THEME_KEY } from '@lib/configs/constants';
import { PropsWithChildren, memo, useContext, useEffect } from 'react';

import { getThemeValue, reflectTheme, setLocalStorage } from '@shared/utils/dom';

function HomeLayout({ children }: PropsWithChildren) {
	const { setContext } = useContext(AppContext);

	useEffect(() => {
		// Sync theme
		// TODO: Sync theme with prefers-color-scheme
		const theme = getThemeValue();
		setContext({ theme });
		setLocalStorage(STORAGE_THEME_KEY, theme);
		reflectTheme(theme);
	}, [setContext]);

	return (
		<main className=" bg-slate-50 dark:bg-slate-900 font-sans relative min-h-screen-d" data-testid="homepage-testid">
			<div className="container mx-auto">
				<div className="sticky top-0 z-10">
					<Navbar />
				</div>
				<div className="relative">{children}</div>
				<Footer />
			</div>
		</main>
	);
}

export default memo(HomeLayout);
