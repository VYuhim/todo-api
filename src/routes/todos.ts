import Router from 'koa-router';
import { Todo, User } from '../models';
import { updateBodyValidator } from '../helpers/updateBodyValidator';
import { authMiddleware } from '../middlewares/authMiddleware';

export const todosRouter = new Router({ prefix: '/todos' });

todosRouter
  .get('/:id', authMiddleware, async (ctx) => {
    const { id } = ctx.params;
    const user = ctx.state.user as User;

    try {
      const todo = await Todo.findByPk(id, { rejectOnEmpty: true });

      if (todo.owner !== user.login) {
        return ctx.throw('forbidden', 403);
      }

      ctx.status = 200;
      ctx.body = todo.toJSON();
    } catch (err) {
      return ctx.throw('todo not found', 404);
    }
  })
  .patch('/:id', authMiddleware, async (ctx) => {
    const { id } = ctx.params;
    const { description, isDone } = ctx.request.body;
    const user = ctx.state.user as User;

    try {
      const todoItem = await Todo.findByPk(id, { rejectOnEmpty: true });

      if (todoItem.owner !== user.login) {
        return ctx.throw('forbidden', 403);
      }

      const updatedTodoItem = await todoItem.update(updateBodyValidator({ description, isDone }));
      ctx.status = 200;
      ctx.body = updatedTodoItem.toJSON();
    } catch (err) {
      return ctx.throw('todo not found', 404);
    }
  })
  .delete('/:id', authMiddleware, async (ctx) => {
    const { id } = ctx.params;
    const user = ctx.state.user as User;

    try {
      const todoItem = await Todo.findByPk(id, { rejectOnEmpty: true });

      if (todoItem.owner !== user.login) {
        return ctx.throw('forbidden', 403);
      }

      await todoItem.destroy();
      ctx.status = 204;
    } catch (err) {
      return ctx.throw(404, 'todo not found');
    }
  });
