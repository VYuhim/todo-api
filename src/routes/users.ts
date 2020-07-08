import Router from 'koa-router';
import bcrypt from 'bcrypt';
import {User} from "../models";
import {updateBodyValidator} from "../helpers/updateBodyValidator";
import {authMiddleware} from "../middlewares/authMiddleware";

export const usersRouter = new Router({prefix: '/users'});

usersRouter
	.post('/', async (ctx) => {
		const {login, email, password} = ctx.request.body;

		if (!login?.trim()) {
			return ctx.throw('field "name" is required', 400);
		}
		if (!email?.trim()) {
			return ctx.throw('field "email" is required', 400);
		}
		if (!password?.trim()) {
			return ctx.throw('field "password" is required', 400);
		}
		if (password.trim().length < 8) {
			return ctx.throw('field "password" must be longer then 8 chars', 400);
		}

		const passwordHash = await bcrypt.hash(password.trim(), 12);
		const user = await User.create({ login, email, password: passwordHash });

		ctx.status = 201;
		ctx.body = user.toJSON();
	})
	.patch('/:login', authMiddleware, async (ctx) => {
		const {login} = ctx.params;
		const {email, password, oldPassword = ''} = ctx.request.body;
		const user = ctx.state.user as User;

		if (login !== user.login) {
			return ctx.throw('forbidden', 403);
		}

		const compare = await bcrypt.compare(oldPassword, user.password);
		if (!compare) {
			return ctx.throw('forbidden', 403);
		}

		if (password && password.trim().length < 8) {
			return ctx.throw('field "password" must be longer then 8 chars', 400);
		}

		let passwordHash = undefined;
		if (password) {
			passwordHash = await bcrypt.hash(password.trim(), 12);
		}

		const updatedUser = await user.update(updateBodyValidator({email, password: passwordHash}));
		ctx.status = 200;
		ctx.body = JSON.stringify({
			login: updatedUser.login,
			email: updatedUser.email,
			createdAt: updatedUser.createdAt,
			updatedAt: updatedUser.updatedAt,
			_links: updatedUser._links
		});
	})
	.delete('/:login', authMiddleware, async (ctx) => {
		const {login} = ctx.params;
		const user = ctx.state.user as User;

		if (login !== user.login) {
			return ctx.throw('forbidden', 403);
		}

		await user.destroy();
		ctx.status = 204;
	})
	.get('/:login/todos', authMiddleware, async (ctx) => {
		const {login} = ctx.params;
		const user = ctx.state.user as User;

		if (login !== user.login) {
			return ctx.throw('forbidden', 403);
		}

		ctx.status = 200;
		ctx.body = JSON.stringify(user.todos);
	})
	.post('/:login/todos', authMiddleware, async (ctx) => {
		const {login} = ctx.params;
		const user = ctx.state.user as User;
		const {description} = ctx.request.body;

		if (login !== user.login) {
			return ctx.throw('forbidden', 403);
		}

		if (!description?.trim()) {
			return ctx.throw('field "description" is required', 400);
		}

		const todo = await user.createTodo({description});
		ctx.status = 201;
		ctx.body = todo.toJSON();
	});