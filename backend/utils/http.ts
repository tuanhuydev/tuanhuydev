import { NextApiResponse } from 'next';

import BaseError from '@shared/commons/errors/BaseError';

export const handleApiError = (error: any, res: NextApiResponse) => {
	return error instanceof BaseError ? (error as BaseError).getApiResponse(res) : error;
};

export const successResponse = (data: any) => ({ success: true, data });
export const failResponse = (message: string) => ({ success: false, error: message });
