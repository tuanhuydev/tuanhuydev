import { PropsWithChildren, memo, useContext, useEffect } from 'react';

import { STORAGE_PLAYSOUND_KEY, STORAGE_THEME_KEY } from '@shared/configs/constants';
import { getSoundValue, getThemeValue, reflectSound, reflectTheme, setLocalStorage } from '@shared/utils/dom';

import Navbar from '../../Home/Navbar';
import Footer from '../Footer';
import { AppContext } from '../hocs/WithProvider';

const gridItems = 'col-span-full md:col-start-2 md:col-span-10';

function BaseLayout({ children }: PropsWithChildren) {
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
		if (!hasStorage) {
			setLocalStorage(STORAGE_PLAYSOUND_KEY, playSound);
		}
		setContext({ playSound });
		reflectSound(playSound);

		const audioEl = document.getElementById('audio') as HTMLAudioElement;
		const buttonEls = document.querySelectorAll('button, a') as NodeListOf<Element>;

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
		<main className="grid grid-cols-12 bg-slate-50 dark:bg-slate-900 font-sans relative min-h-screen-d">
			<div className={`${gridItems} sticky top-0 z-10`}>
				<Navbar />
			</div>
			<div className={`${gridItems} relative`}>{children}</div>
			<div className={`${gridItems} relative`}>
				<Footer />
			</div>
		</main>
	);
}

export default memo(BaseLayout, () => false);
