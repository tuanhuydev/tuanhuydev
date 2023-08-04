import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {
	ACCESS_TOKEN_LIFE,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_LIFE,
	REFRESH_TOKEN_SECRET,
} from '@shared/commons/constants/encryption';
import BaseError from '@shared/commons/errors/BaseError';
import NotFoundError from '@shared/commons/errors/NotFoundError';

import prismaClient from '@backend/database/prismaClient';

class AuthService {
	async validateSignIn(email: string, password: string) {
		const userByEmail = await prismaClient.user.findUnique({ where: { email } });

		if (!userByEmail) throw new NotFoundError('Invalid user');

		if (!bcrypt.compareSync(password, userByEmail.password)) throw new BaseError('Invalid credential');

		return userByEmail;
	}

	async signIn(email: string, password: string) {
		try {
			const { id: userId, email: userEmail }: User = await this.validateSignIn(email, password);
			const accessToken = jwt.sign({ userId, userEmail }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE });
			const refreshToken = jwt.sign({ userId, userEmail }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE });

			return { accessToken, refreshToken };
		} catch (error) {
			console.log(error);
		}
	}

	forgotPassword(email: string) {
		//TODO: verify email exist and handle forgot password link
	}
	resetPassword(token: string) {
		//TODO: handle reset password here
	}
}

export default new AuthService();
