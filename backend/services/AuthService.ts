import {
	ACCESS_TOKEN_LIFE,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_LIFE,
	REFRESH_TOKEN_SECRET,
} from '@shared/commons/constants/encryption';
import BaseError from '@shared/commons/errors/BaseError';
import NotFoundError from '@shared/commons/errors/NotFoundError';
import { SALT_ROUNDS } from '@shared/configs/constants';
import prismaClient from '@backend/prismaClient';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
class AuthService {
	async signIn(email: string, plainPassword: string) {
		//TODO: verify email and password here
		const existingUser = await prismaClient.user.findUnique({
			where: { email },
		});

		if (!existingUser) {
			throw new NotFoundError('Invalid user');
		}

		if (!bcrypt.compareSync(plainPassword, existingUser.password)) {
			throw new BaseError('Invalid credential');
		}
		const tokenData = {
			id: existingUser.id,
			name: existingUser.name,
			email: existingUser.email,
		};

		const token = jwt.sign(tokenData, ACCESS_TOKEN_SECRET, {
			expiresIn: ACCESS_TOKEN_LIFE,
		});

		const refreshToken = jwt.sign({ email }, REFRESH_TOKEN_SECRET, {
			expiresIn: REFRESH_TOKEN_LIFE,
		});

		return { token, refreshToken };
	}

	forgotPassword(email: string) {
		//TODO: verify email exist and handle forgot password link
	}
	resetPassword(token: string) {
		//TODO: handle reset password here
	}
}

export default new AuthService();
