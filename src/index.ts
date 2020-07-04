import Koa from 'koa';
import koaBody from 'koa-body';
import { todoRouter } from './routes/todos';
import { sequelize } from './models';
import cors from '@koa/cors';
import os from 'os';

import './models';
import { swaggerRouter } from './routes/swagger';

const PORT = 3000;
const app = new Koa();

// middlewares
app.use(cors()).use(koaBody());

// routes
app.use(swaggerRouter.routes()).use(todoRouter.routes());

// developing mode only
sequelize.sync({ alter: true }).then(() => {
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
