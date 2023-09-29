import { HTTP_CODE } from '../constants/httpCode';
import BaseError from './BaseError';

export default class BadRequestError extends BaseError {
	constructor(message: string = '[ERROR] BAD REQUEST') {
		super(message, HTTP_CODE.NOT_FOUND_ERROR);
	}
}
