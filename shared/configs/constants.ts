import CProject from '@public/assets/images/projects/c.svg';
import CTIProject from '@public/assets/images/projects/cti.svg';
import EProject from '@public/assets/images/projects/e.svg';
import IProject from '@public/assets/images/projects/i.svg';
import PulseProject from '@public/assets/images/projects/pulse.svg';

import { ObjectType } from '@shared/interfaces/base';

// Default Type
export const EMPTY_OBJECT: ObjectType = {};
export const EMPTY_STRING: string = '';

// Theme
export const DEFAULT_THEME: string = 'light';
export const STORAGE_THEME_KEY: string = 'theme-preference';
export const STORAGE_PLAYSOUND_KEY: string = 'sound-preference';
export const STORAGE_CREDENTIAL_KEY: string = 'credential';

// Encryption
export const SALT_ROUNDS: number = 12;

// Environments
const DEFAULT_ENV = 'development';
export const NODE_ENV: string = process.env.NODE_ENV ?? DEFAULT_ENV;
export const GOOGLE_ADSENSE: string = process.env.GOOGLE_ADSENSE ?? EMPTY_STRING;
export const GOOGLE_TAG = process.env.GOOGLE_ADSENSE ?? EMPTY_STRING;
export const BASE_URL =
	process.env.HOST && process.env.PORT ? `${process.env.HOST}:${process.env.PORT}` : 'http://localhost:3000';

export const POST_STATUS = {
	PUBLISHED: 'PUBLISHED',
	DRAFT: 'DRAFT',
};

export type PostStatusType = typeof POST_STATUS;

export const MOCK_PROJECTS = [
	{
		image: EProject,
		title: 'Project E',
		description:
			'E is a data processing and recommendation service to help the client improve their business and customer relationship',
		time: '2022',
		technicals: ['Angular', 'PrimeNG'],
		credential: true,
	},
	{
		image: CProject,
		title: 'Project C',
		description:
			'C is a migration from lengacy code to lastest technologies and support department to interact with customers.',
		time: '2021-2022',
		technicals: ['Angular', 'ngRx', 'PrimeNG'],
		credential: true,
	},
	{
		image: IProject,
		title: 'Project I',
		description:
			'I is a system to help connect and deploy marketing department and customers, deploy efficiency campaigns to the market.',
		time: '2021',
		technicals: ['ReactJS', 'Redux', 'NodeJS'],
		credential: true,
	},
	{
		image: PulseProject,
		title: 'PulseMS',
		url: 'https://www.pulsecollab.com/',
		description:
			'PulseMS is a complex all-in-one management system providing powerful features to manage resources, budget, and planning for the enterprise.',
		time: '2020-2021',
		technicals: ['ReactJS', 'Redux', 'Bryntum', 'Laravel'],
	},
	{
		image: CTIProject,
		title: 'CTI',
		url: 'https://caretransitions.health/',
		description:
			"CTI is an evidence-based, short-term model that complements a systems's care team by activating patient engagement in their health management.",
		time: '2019-2020',
		technicals: ['NextJS', 'TypeORM', 'Auth0'],
	},
];
