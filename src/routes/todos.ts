import Router from 'koa-router';
import { Todo } from '../models';
import {createErrorResponse} from "../helpers/createErrorResponse";
import {updateBodyValidator} from "../helpers/updateBodyValidator";

export const todosRouter = new Router({ prefix: '/todos' });

todosRouter
  .get('/:id', async (ctx) => {
    const { id } = ctx.params;

    try {
      const todo = await Todo.findByPk(id);

      if (todo) {
        ctx.status = 200;
        ctx.body = todo.toJSON();
      } else {
        createErrorResponse(ctx, {statusCode: 404, message: 'todo not found'});
      }

    } catch (err) {
      ctx.throw(err);
    }
  })
  .patch('/:id', async (ctx) => {
    const { id } = ctx.params;
    const {description, isDone} = ctx.request.body;

    try {
      const todoItem = await Todo.findByPk(id);

      if (todoItem) {
        const updatedTodoItem = await todoItem.update(updateBodyValidator({description, isDone}));

        ctx.status = 200;
        ctx.body = updatedTodoItem.toJSON();
      } else {
        createErrorResponse(ctx, {statusCode: 404, message: 'todo not found'});
      }

    } catch (err) {
      ctx.throw(err);
    }
  })
  .delete('/:id', async (ctx) => {
    const { id } = ctx.params;

    try {
      const todoItem = await Todo.findByPk(id);

      if (todoItem) {
        await todoItem.destroy();
        ctx.status = 204;
      } else {
        createErrorResponse(ctx, {statusCode: 404, message: 'todo not found'});
      }

    } catch (err) {
      ctx.throw(err);
    }
  });
