import { NextRequest, NextResponse } from 'next/server';

import { HTTP_CODE } from '@shared/commons/constants/httpCode';
import BaseError from '@shared/commons/errors/BaseError';
import { NODE_ENV } from '@shared/configs/constants';
import { ObjectType } from '@shared/interfaces/base';

class Network {
	#req: NextRequest;
	cookie?: string;

	static #instance: Network;

	constructor(req: NextRequest) {
		this.#req = req;
	}

	static makeInstance(req: NextRequest) {
		if (Network.#instance) {
			return Network.#instance;
		}
		return new Network(req);
	}

	extractSearchParams(searchParams: URLSearchParams): ObjectType {
		const params: ObjectType = {};
		const numbericKeys = ['page', 'pageSize'];
		const booleanKeys = ['active'];

		for (let [key, values] of searchParams.entries()) {
			if (numbericKeys.includes(key)) params[key] = parseInt(values, 10);
			else if (booleanKeys.includes(values)) params[key] = Boolean(values === 'true');
		}
		return params;
	}

	setCookie(key: string, value: any) {
		this.cookie = `${key}=${value}`;
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
