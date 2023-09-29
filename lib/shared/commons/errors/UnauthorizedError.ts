import { HTTP_CODE } from '../constants/httpCode';
import BaseError from './BaseError';

export default class UnauthorizedError extends BaseError {
	constructor(message: string = '[ERROR] UNAUTHORIZED') {
		super(message, HTTP_CODE.UNAUTHORIZED_ERROR);
	}
}
