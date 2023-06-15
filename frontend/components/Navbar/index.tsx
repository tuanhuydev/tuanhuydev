import Link from 'next/link';
import { useContext } from 'react';
import { DEFAULT_THEME, STORAGE_PLAYSOUND_KEY, STORAGE_THEME_KEY } from '@shared/configs/constants';
import { reflectSound, reflectTheme, setLocalStorage } from '@shared/utils/dom';
import { AppContext } from '../hocs/WithProvider';
import styles from './styles.module.scss';
import React from 'react';
import logoSrc from '@frontend/assets/images/logo.svg';
import Image from 'next/image';

const buttonStyles =
	'rounded-md drop-shadow bg-white dark:drop-shadow-none dark:bg-slate-50 dark:hover:bg-slate-300 transition ease-in';

function Navbar() {
	// Hooks
	const { context, setContext } = useContext(AppContext);

	const { theme, playSound } = context;

	const switchTheme = () => {
		const newThemeValue = theme === DEFAULT_THEME ? 'dark' : DEFAULT_THEME;
		setContext({ theme: newThemeValue });
		setLocalStorage(STORAGE_THEME_KEY, newThemeValue);
		reflectTheme(newThemeValue);
	};

	const toggleSound = () => {
		const newSoundState = !playSound;
		setContext({ playSound: newSoundState });
		setLocalStorage(STORAGE_PLAYSOUND_KEY, newSoundState);
		reflectSound(newSoundState);
	};

	return (
		<header className="flex items-center justify-between py-2 bg-slate-50 dark:bg-slate-900 px-4 md:px-0">
			<div className="text-primary dark:text-slate-50 font-bold text-xl md:text-2xl flex items-center">
				<Link href={'/'} legacyBehavior>
					<a className="line-height-1 hover:underline flex cursor-pointer">
						<Image src={logoSrc} width={32} height={32} alt="page logo" />
						<h1 className="inline">tuanhuydev</h1>
					</a>
				</Link>
			</div>
			<div className="flex items-center">
				{/* <ul className="hidden md:flex md:justify-between">
          <li className="mr-3.5 cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-900">
            <Link href="/articles">
              <div className="block px-4 py-1 dark:text-white capitalize">
                articles
              </div>
            </Link>
          </li>
        </ul> */}
				<button className={`${buttonStyles} p-2 mr-2 md:mr-3`} onClick={toggleSound}>
					{playSound ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="18"
							viewBox="0 96 960 960"
							width="18"
							className={`${styles.sound} ${styles[theme]}`}>
							<path d="M560 925v-62q97-28 158.5-107.5T780 575q0-101-61-181T560 287v-62q124 28 202 125.5T840 575q0 127-78 224.5T560 925ZM120 696V456h160l200-200v640L280 696H120Zm420 48V407q55 17 87.5 64T660 576q0 57-33 104t-87 64Z" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="18"
							viewBox="0 96 960 960"
							width="18"
							className={`${styles.sound} ${styles[theme]}`}>
							<path d="M813 1000 681 868q-28 20-60.5 34.5T553 925v-62q23-7 44.5-15.5T638 825L473 659v237L273 696H113V456h156L49 236l43-43 764 763-43 44Zm-36-232-43-43q20-34 29.5-72t9.5-78q0-103-60-184.5T553 287v-62q124 28 202 125.5T833 575q0 51-14 100t-42 93ZM643 634l-90-90V414q47 22 73.5 66t26.5 96q0 15-2.5 29.5T643 634ZM473 464 369 360l104-104v208Z" />
						</svg>
					)}
				</button>
				<button
					className={`${styles.toggle} ${styles[theme]} ${buttonStyles} p-2 mr-2 md:mr-7`}
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
				<Link href={'#contact'} legacyBehavior>
					<a className="rounded-full bg-stone-900 drop-shadow-md text-white dark:bg-slate-50 dark:text-primary text-slate-50 uppercase font-semibold px-2 py-0.5 md:px-4 md:py-1 cursor-pointer">
						Contact
					</a>
				</Link>
			</div>
		</header>
	);
}
export default React.memo(Navbar, () => false);
