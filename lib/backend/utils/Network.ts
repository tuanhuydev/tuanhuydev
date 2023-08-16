import { HTTP_CODE } from 'lib/shared/commons/constants/httpCode';
import BaseError from 'lib/shared/commons/errors/BaseError';
import { NODE_ENV } from 'lib/shared/configs/constants';
import { ObjectType } from 'lib/shared/interfaces/base';
import { NextRequest, NextResponse } from 'next/server';

class Network {
	#req: NextRequest;
	cookie?: string;

	static #instance: Network;

	constructor(req: NextRequest) {
		this.#req = req;
	}

	setCookie(key: string, value: any) {
		this.cookie = `${key}=${value}`;
	}

	static makeInstance(req: NextRequest) {
		if (Network.#instance) {
			return Network.#instance;
		}
		return new Network(req);
	}

	successResponse(data: any) {
		const options: ObjectType = { status: 200 };
		if (this.cookie) {
			options['Set-Cookie'] = this.cookie;
		}
		return new NextResponse(JSON.stringify({ success: true, data }), options);
	}

	failResponse = (error: BaseError) => {
		if (NODE_ENV !== 'production') console.error(error);
		const { message, status = HTTP_CODE.INTERNAL_ERROR } = error;
		const options: ObjectType = { status };

		const dataString = JSON.stringify({ success: false, error: message });
		return new NextResponse(dataString, options);
	};
}

export default Network.makeInstance;
