import Router from 'koa-router';
import YAML from 'yamljs';
import path from 'path';
import koaSwagger from 'koa2-swagger-ui';

const spec = YAML.load(path.join(__dirname, '..', 'swagger', 'swagger.yaml'));

export const swaggerRouter = new Router();
swaggerRouter.use(koaSwagger());
swaggerRouter.get('/swagger', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));
