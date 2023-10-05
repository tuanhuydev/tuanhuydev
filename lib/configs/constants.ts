import { ObjectType } from '@shared/interfaces/base';

// Default Type
export const EMPTY_OBJECT: ObjectType = {};
export const EMPTY_STRING: string = '';

// Theme
export const DEFAULT_THEME: string = 'light';
export const STORAGE_THEME_KEY: string = 'theme-preference';
export const STORAGE_CREDENTIAL_KEY: string = 'credential';

// Encryption
export const SALT_ROUNDS: number = 12;

// Environments
const DEFAULT_ENV: string = 'development';
export const NODE_ENV: string = process.env.NODE_ENV ?? DEFAULT_ENV;
export const GOOGLE_ADSENSE: string = process.env.GOOGLE_ADSENSE ?? EMPTY_STRING;
export const GOOGLE_TAG: string = process.env.GOOGLE_ADSENSE ?? EMPTY_STRING;
export const BASE_URL = process.env.HOST ?? 'http://localhost:3000';

export const POST_STATUS = {
	PUBLISHED: 'PUBLISHED',
	DRAFT: 'DRAFT',
};

export type PostStatusType = typeof POST_STATUS;

export const DATE_FORMAT = 'dd-MMM-yyyy';

// AWS
export const awsRegion = process.env.AWS_REGION || EMPTY_STRING;
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || EMPTY_STRING;
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || EMPTY_STRING;
export const awsBucketName = process.env.AWS_BUCKET_NAME || EMPTY_STRING;
