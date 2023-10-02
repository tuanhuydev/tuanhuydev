'use client';

import Footer from '@lib/HomeModule/Footer';
import Navbar from '@lib/HomeModule/Navbar';
import { AppContext } from '@lib/components/hocs/WithProvider';
import { STORAGE_PLAYSOUND_KEY, STORAGE_THEME_KEY } from '@lib/configs/constants';
import { PropsWithChildren, memo, useContext, useEffect } from 'react';

import { getSoundValue, getThemeValue, reflectSound, reflectTheme, setLocalStorage } from '@shared/utils/dom';

function HomeLayout({ children }: PropsWithChildren) {
	const { setContext } = useContext(AppContext);

	useEffect(() => {
		// Sync theme
		// TODO: Sync theme with prefers-color-scheme
		const theme = getThemeValue();
		setContext({ theme });
		setLocalStorage(STORAGE_THEME_KEY, theme);
		reflectTheme(theme);

		// Sync sound
		const { hasStorage, value: playSound } = getSoundValue();
		if (!hasStorage) setLocalStorage(STORAGE_PLAYSOUND_KEY, playSound);

		setContext({ playSound });
		reflectSound(playSound);

		const audioEl = document.getElementById('audio') as HTMLAudioElement;
		const buttonEls = document.querySelectorAll('button, a, .cursor-pointer') as NodeListOf<Element>;

		const playSoundEvent = () => audioEl.play();

		if (playSound) {
			buttonEls.forEach((node: Element) => {
				node?.addEventListener('click', playSoundEvent, false);
			});
		}

		return () => {
			buttonEls.forEach((node: Element) => {
				node?.removeEventListener('click', playSoundEvent);
			});
		};
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
