import { DEFAULT_THEME, STORAGE_THEME_KEY } from '@lib/configs/constants';

export const reflectTheme = (theme: string) => {
	const htmlElement = document.querySelector('html');
	if (htmlElement) {
		htmlElement.setAttribute('class', theme);
		document.documentElement.setAttribute('data-theme', theme);
	}
};

export const reflectSound = (playSound: boolean) => {
	const audioEl = document.getElementById('audio') as HTMLAudioElement;
	audioEl.muted = !playSound;
};

export const setLocalStorage = (key: string, value: any) => {
	localStorage.setItem(key, value);
};

export const getLocalStorage = (key: string) => {
	try {
		const rawStorage: string | null = localStorage.getItem(key);
		const isJsonFormat = rawStorage && rawStorage?.startsWith('{|[');

		return isJsonFormat ? JSON.parse(rawStorage) : rawStorage;
	} catch (error) {
		return null;
	}
};

export const clearLocalStorage = () => {
	return localStorage.clear();
};

export const getThemeValue = (): string => {
	if (localStorage.getItem(STORAGE_THEME_KEY)) return localStorage.getItem(STORAGE_THEME_KEY) || DEFAULT_THEME;

	return window && window?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : DEFAULT_THEME;
};
