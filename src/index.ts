import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import os from 'os';
import dotenv from 'dotenv';
import { sequelize } from './models';
import { todosRouter } from './routes/todos';
import { logOutRouter } from './routes/logOut';

import { swaggerRouter } from './routes/swagger';
import { usersRouter } from './routes/users';
import { loginRouter } from './routes/login';
import { PORT } from './constants';

dotenv.config();

const app = new Koa();

// middlewares
app.use(cors()).use(koaBody());

// routes
app
  .use(swaggerRouter.routes())
  .use(loginRouter.routes())
  .use(logOutRouter.routes())
  .use(usersRouter.routes())
  .use(todosRouter.routes());

sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    Object.values(os.networkInterfaces()).forEach((id) => {
      id?.forEach((networkInterface) => {
        if (!networkInterface.internal && networkInterface.family === 'IPv4') {
          console.clear();
          console.log(`Server started in: http://${networkInterface.address}:${PORT}`);
          console.log(`Swagger: http://${networkInterface.address}:${PORT}/swagger`);
        }
      });
    });
  });
});
