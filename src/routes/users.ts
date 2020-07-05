import Router from 'koa-router';
import {createErrorResponse} from "../helpers/createErrorResponse";
import {User} from "../models";
import {updateBodyValidator} from "../helpers/updateBodyValidator";

export const usersRouter = new Router({prefix: '/users'});

usersRouter
	.post('/', async (ctx) => {
		const {name} = ctx.request.body;

		if (!name?.trim()) {
			createErrorResponse(ctx, {statusCode: 400, message: 'field "name" is required'})
		}

		try {
			const user = await User.create({ name });

			ctx.status = 201;
			ctx.body = user.toJSON();
		} catch (err) {
			ctx.throw(err);
		}
	})
	.patch('/:id', async (ctx) => {
		const {id} = ctx.params;
		const {name} = ctx.request.body;

		try {
			const user = await User.findByPk(id);

			if (user) {
				const updatedUser = await user.update(updateBodyValidator({name}));

				ctx.status = 200;
				ctx.body = updatedUser.toJSON();
			} else {
				createErrorResponse(ctx, { statusCode: 404, message: 'user not found'});
			}

		} catch (err) {
			ctx.throw(err);
		}
	})
	.delete('/:id', async (ctx) => {
		const {id} = ctx.params;

		try {
			const user = await User.findByPk(id);

			if (user) {
				await user.destroy();

				ctx.status = 204;
			} else {
				createErrorResponse(ctx, {statusCode: 404, message: 'user not found'});
			}

		} catch (err) {
			ctx.throw(err);
		}
	})
	.get('/:id/todos', async (ctx) => {
		const {id} = ctx.params;

		try {
			const user = await User.findByPk(id);

			if (user) {
				const todos = await user.getTodos();

				ctx.status = 200;
				ctx.body = JSON.stringify(todos);
			} else {
				createErrorResponse(ctx, {statusCode: 404, message: 'user not found'});
			}
		} catch (err) {
			ctx.throw(err);
		}
	})
	.post('/:id/todos', async (ctx) => {
		const {id} = ctx.params;
		const {description} = ctx.request.body;

		if (!description?.trim()) {
			createErrorResponse(ctx, {statusCode: 400, message: 'field "description" is required'});
		}

		try {
			const user = await User.findByPk(id);

			if (user) {
				const todo = await user.createTodo({description});

				ctx.status = 201;
				ctx.body = todo.toJSON();
			} else {
				createErrorResponse(ctx, {statusCode: 404, message: 'user not found'});
			}

		} catch (err) {
			ctx.throw(err);
		}
	});