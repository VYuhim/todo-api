import Router from 'koa-router';
import {Todo} from "../models";

export const todoRouter = new Router({prefix: '/todos'});

todoRouter
	.get('/', async (ctx) => {
		try {
			const todos = await Todo.findAll();
			ctx.body = todos.map(todo => todo.toJSON());
		} catch (err) {
			ctx.onerror(err)
		}
	})
	.post('/', async (ctx) => {
		try {
			const todo = ctx.request.body;
			const todoItem = await Todo.create({description: todo.description});

			ctx.body = todoItem.toJSON();
		} catch (err) {
			ctx.onerror(err);
		}
	})
	.get('/:id', async (ctx) => {
		const {id} = ctx.params;
		try {
			const todo = await Todo.findOne({where: {id}});

			if (todo) {
				ctx.body = todo.toJSON();
			} else {
				ctx.status = 404;
				ctx.message = 'todo not found';
				ctx.body = {error: 'todo not found'}
			}
		} catch (err) {
			ctx.onerror(err);
		}
	})
	.patch('/:id', async (ctx) => {
		try {
			const todoItem = await Todo.findOne({where: { id: ctx.params.id }});
			if (todoItem) {
				await todoItem.update(ctx.request.body)

				ctx.body = todoItem;
			} else {
				ctx.status = 404;
				ctx.body = {error: 'todo not found'};
			}
		} catch (err) {
			ctx.onerror(err);
		}
	})
	.delete('/:id', async (ctx) => {
		try {
			const todoItem = await Todo.findOne({where: { id: ctx.params.id}});
			if (todoItem) {
				await todoItem.destroy();
				ctx.status = 200;
				ctx.body = { success: true };
			} else {
				ctx.status = 404;
				ctx.body = {error: 'todo not found'};
			}
		} catch (err) {
			ctx.onerror(err);
		}
	});