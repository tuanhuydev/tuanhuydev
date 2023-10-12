'use client';

import { AppContext } from '@lib/components/hocs/WithProvider';
import { DEFAULT_THEME, STORAGE_THEME_KEY } from '@lib/configs/constants';
import { memo, useCallback, useContext } from 'react';

import { reflectTheme, setLocalStorage } from '@shared/utils/dom';

import styles from './styles.module.scss';

const buttonStyles =
	'rounded-md drop-shadow bg-white dark:drop-shadow-none dark:bg-slate-50 dark:hover:bg-slate-300 transition ease-in';

function Navbar() {
	// Hooks
	const { context, setContext } = useContext(AppContext);

	const { theme, playSound } = context;

	const switchTheme = useCallback(() => {
		const newThemeValue = theme === DEFAULT_THEME ? 'dark' : DEFAULT_THEME;
		setContext({ theme: newThemeValue });
		setLocalStorage(STORAGE_THEME_KEY, newThemeValue);
		reflectTheme(newThemeValue);
	}, [setContext, theme]);

	// const toggleSound = useCallback(() => {
	// 	const newSoundState = !playSound;
	// 	setContext({ playSound: newSoundState });
	// 	setLocalStorage(STORAGE_PLAYSOUND_KEY, newSoundState);
	// 	reflectSound(newSoundState);
	// }, [playSound, setContext]);

	return (
		<header className="flex items-center justify-between py-2 bg-slate-50 dark:bg-slate-900 px-2 md:px-0">
			<div className="text-primary dark:text-slate-50 font-bold text-xl md:text-2xl flex items-center">
				<a href="/" className="line-height-1 hover:underline flex items-center cursor-pointer">
					<svg
						width="32"
						height="32"
						viewBox="0 0 16 16"
						fill="none"
						className="fill-primary dark:fill-slate-50"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M2 6.3609V8.31087C2 8.42588 2.06982 8.5301 2.17816 8.57681L6.97816 10.6464C7.17655 10.7319 7.4 10.591 7.4 10.3804V8.98505C7.4 8.86756 7.32718 8.76159 7.21538 8.71641L4.46462 7.60453C4.21846 7.50503 4.21846 7.16674 4.46462 7.06724L7.21538 5.95536C7.32718 5.91017 7.4 5.80421 7.4 5.68672V4.29136C7.4 4.08075 7.17654 3.93988 6.97816 4.02541L2.17816 6.09495C2.06982 6.14166 2 6.24589 2 6.3609Z" />
						<path d="M14 10.6391V8.68913C14 8.57412 13.9302 8.4699 13.8218 8.42319L9.02184 6.35364C8.82346 6.26811 8.6 6.40898 8.6 6.61959V8.01495C8.6 8.13244 8.67282 8.23841 8.78462 8.28359L11.5354 9.39547C11.7815 9.49497 11.7815 9.83326 11.5354 9.93276L8.78462 11.0446C8.67282 11.0898 8.6 11.1958 8.6 11.3133V12.7086C8.6 12.9192 8.82346 13.0601 9.02184 12.9746L13.8218 10.905C13.9302 10.8583 14 10.7541 14 10.6391Z" />
					</svg>
					<h1 className="inline text-2xl">tuanhuydev</h1>
				</a>
			</div>
			<div className="flex items-center">
				<ul className="flex md:justify-between">
					<li className="mr-3.5 cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-900">
						<a href="#blog">
							<div className="block px-4 py-1 dark:text-white capitalize">Blog</div>
						</a>
					</li>
				</ul>
				<button
					className={`${styles.toggle} ${styles[theme]} ${buttonStyles} p-2 mr-2 md:mr-7 border-none flex items-center`}
					title="Toggles light & dark"
					aria-live="polite"
					onClick={switchTheme}>
					<svg className={styles.icon} aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
						<mask className={styles.moon} id="moon-mask">
							<rect x="0" y="0" width="100%" height="100%" fill="white" />
							<circle cx="24" cy="10" r="6" fill="black" />
						</mask>
						<circle className={styles.sun} cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
						<g className={styles.beams} stroke="currentColor">
							<line x1="12" y1="1" x2="12" y2="3" />
							<line x1="12" y1="21" x2="12" y2="23" />
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
							<line x1="1" y1="12" x2="3" y2="12" />
							<line x1="21" y1="12" x2="23" y2="12" />
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
						</g>
					</svg>
				</button>
				<a
					href="#contact"
					className="rounded-full bg-stone-900 drop-shadow-md dark:bg-slate-50 dark:text-primary text-slate-50 text-sm md:text-base uppercase font-semibold px-2 py-0.5 md:px-4 md:py-1 cursor-pointer">
					Contact
				</a>
			</div>
		</header>
	);
}
export default memo(Navbar);
