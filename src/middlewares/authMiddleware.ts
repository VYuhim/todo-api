import {Middleware} from "koa";
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "../constants";
import {User} from "../models";

export const authMiddleware: Middleware = async (ctx, next) => {
	const token = ctx.cookies.get('token');

	if (!token) {
		return ctx.throw( 401, 'unauthorized');
	}

	const { login } = jwt.verify(token, JWT_SECRET) as any;

	try {
		if (!login) {
			throw new Error('user not found');
		}

		const user = await User.findByPk(login, {rejectOnEmpty: true});
		ctx.state.user = user;
		await next();
	} catch (err) {
		return ctx.throw(404, 'user not found');
	}
}