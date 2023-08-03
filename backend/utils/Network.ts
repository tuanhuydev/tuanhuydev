import { NextApiRequest, NextApiResponse } from 'next';

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
			message: error.message,
		});
	};
}

export default Network.makeInstance;
