import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {User} from "../models";
import {COOKIE_LIFE_TIME, JWT_SECRET} from "../constants";
import {authMiddleware} from "../middlewares/authMiddleware";

export const loginRouter = new Router({prefix: '/login'});

loginRouter
	.get('/', authMiddleware, async (ctx) => {
		const user = ctx.state.user as User;

		ctx.status = 200;
		ctx.body = JSON.stringify({
			login: user.login,
			email: user.email,
			_links: user._links,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
		})
	})
	.post('/', async (ctx) => {
		const {login, password} = ctx.request.body;
		try {
			const user = await User.findByPk(login, {rejectOnEmpty: true});

			if (user) {
				const verify = await bcrypt.compare(password, user?.password);

				if (verify) {
					const token = jwt.sign(
						{
							login: login
						},
						JWT_SECRET,
						{
							expiresIn: COOKIE_LIFE_TIME
						});
					ctx.cookies.set('token', token, {httpOnly: true, expires: new Date(Date.now() + COOKIE_LIFE_TIME)});
					ctx.status = 200;
					ctx.body = JSON.stringify({
						login: user.login,
						email: user.email,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
						_links: user._links,
					});
				} else {
					return ctx.throw('incorrect login or password', 404);
				}
			} else {
				return ctx.throw('incorrect login or password', 404);
			}
		} catch (err) {
			ctx.throw('not found', 404);
		}
	})