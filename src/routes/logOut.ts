import Router from 'koa-router';

export const logOutRouter = new Router({ prefix: '/logout' });

logOutRouter.get('/', (ctx) => {
  ctx.cookies.set('token', '');
  ctx.status = 204;
});
