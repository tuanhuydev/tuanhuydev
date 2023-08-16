import AuthService from 'lib/backend/services/AuthService';
import Network from 'lib/backend/utils/Network';
import BadRequestError from 'lib/shared/commons/errors/BadRequestError';
import BaseError from 'lib/shared/commons/errors/BaseError';
import UnauthorizedError from 'lib/shared/commons/errors/UnauthorizedError';
import { NextRequest } from 'next/server';
import { ObjectSchema, object, string } from 'yup';

class AuthController {
	#signInSchema: ObjectSchema<any>;

	constructor() {
		this.#signInSchema = object({
			email: string().required(),
			password: string().required(),
		});
	}

	async validateSignIn(body: any) {
		try {
			return this.#signInSchema.validate(body);
		} catch (error) {
			throw new BadRequestError();
		}
	}
	async signIn(request: NextRequest) {
		const network = Network(request);
		try {
			const body = await request.json();
			const { email, password } = await this.validateSignIn(body);
			const auth = await AuthService.signIn(email, password);
			if (!auth) throw new UnauthorizedError('Authenticate Failed');

			network.setCookie('jwt', auth.accessToken);
			return network.successResponse({ token: auth.refreshToken });
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}
	async issueAccessToken(request: NextRequest) {
		const network = Network(request);
		try {
			const { token } = await request.json();
			const auth = await AuthService.issueAccessToken(token);

			return network.successResponse(auth);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}
}

const authController = new AuthController();
export default authController;