import Koa from 'koa';
import koaBody from 'koa-body';
import {sequelize} from './models';
import { todosRouter } from './routes/todos';
import cors from '@koa/cors';
import os from 'os';

import './models';
import { swaggerRouter } from './routes/swagger';
import {usersRouter} from "./routes/users";

const PORT = process.env.PORT || 3000;
const app = new Koa();

// middlewares
app.use(cors()).use(koaBody());

// log errors
app.on('error', (error, ctx) => {
  console.log(error, ctx);
});

// routes
app
  .use(swaggerRouter.routes())
  .use(todosRouter.routes())
  .use(usersRouter.routes());

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    Object.values(os.networkInterfaces()).forEach((id) => {
      id?.forEach((networkInterface) => {
        if (!networkInterface.internal && networkInterface.family === 'IPv4') {
          console.clear();
          console.log(
            `Server started in: http://${networkInterface.address}:${PORT}`
          );
          console.log(
            `Swagger: http://${networkInterface.address}:${PORT}/swagger`
          );
        }
      });
    });
  });
});