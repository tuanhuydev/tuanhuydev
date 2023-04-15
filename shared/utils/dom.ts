import {
	STORAGE_THEME_KEY,
	DEFAULT_THEME,
	STORAGE_PLAYSOUND_KEY,
} from '@shared/configs/constants';
import { ObjectType } from '@shared/interfaces/base';

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

export const updateLocalStorage = (key: string, value: any) => {
	localStorage.setItem(key, value);
};

export const getThemeValue = (): string => {
	if (localStorage.getItem(STORAGE_THEME_KEY))
		return localStorage.getItem(STORAGE_THEME_KEY) || DEFAULT_THEME;

	return window && window?.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: DEFAULT_THEME;
};

export const getSoundValue = (): ObjectType => {
	const DEFAULT_PLAY_SOUND = true;
	const hasStorage = localStorage.getItem(STORAGE_PLAYSOUND_KEY);
	if (hasStorage) {
		return {
			hasStorage,
			value: Boolean(hasStorage),
		};
	}
	return {
		hasStorage: false,
		value: DEFAULT_PLAY_SOUND,
	};
};
