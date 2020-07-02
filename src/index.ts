import Koa from 'koa';
import koaBody from 'koa-body';
import {todoRouter} from "./routes/todos";
import {sequelize} from "./models";
import cors from '@koa/cors';

import './models';
import {swaggerRouter} from "./routes/swagger";

const app = new Koa();

// middlewares
app
	.use(cors())
	.use(koaBody());

// routes
app
	.use(swaggerRouter.routes())
	.use(todoRouter.routes());

// developing mode only
sequelize.sync({alter: true}).then(() => {
	app.listen(3000, () => {
	})
});



