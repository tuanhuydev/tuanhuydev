import { NextApiRequest, NextApiResponse } from 'next';

import BaseError from '@shared/commons/errors/BaseError';

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

	failResponse = (error: BaseError) =>
		this.#res.status(error.status).json({
			success: false,
			message: error.message,
		});
}

export default Network.makeInstance;
