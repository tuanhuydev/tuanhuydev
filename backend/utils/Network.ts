import { CookieSerializeOptions, serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

import { ACCESS_TOKEN_LIFE } from '@shared/commons/constants/encryption';
import BaseError from '@shared/commons/errors/BaseError';
import { NODE_ENV } from '@shared/configs/constants';

class Network {
	#req: NextApiRequest;
	#res: NextApiResponse;
	static #instance: Network;

	constructor(req: NextApiRequest, res: NextApiResponse) {
		this.#req = req;
		this.#res = res;
	}

	setCookie(key: string, value: any) {
		const stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

		const isProduction = NODE_ENV === 'production';
		const cookieExpireInHour = new Date(Date.now() + ACCESS_TOKEN_LIFE * 1000);

		const options: CookieSerializeOptions = {
			expires: cookieExpireInHour,
			httpOnly: isProduction,
			secure: isProduction,
			// sameSite: 'strict',
			maxAge: ACCESS_TOKEN_LIFE,
			path: '/',
		};

		this.#res.setHeader('Set-Cookie', serialize(key, stringValue, options));
	}

	static makeInstance(req: NextApiRequest, res: NextApiResponse) {
		if (Network.#instance) {
			return Network.#instance;
		}
		return new Network(req, res);
	}

	successResponse = (data: any) =>
		this.#res.json({
			success: true,
			data,
		});

	failResponse = (error: BaseError) => {
		if (NODE_ENV !== 'production') console.log(error);
		return this.#res.status(error.status).json({
			success: false,
			error: error.message,
		});
	};
}

export default Network.makeInstance;
