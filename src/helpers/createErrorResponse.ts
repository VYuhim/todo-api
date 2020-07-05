import {ExtendableContext} from "koa";

interface IErrorParams {
	statusCode: number;
	message: string;
}

export const createErrorResponse = (ctx: ExtendableContext & {state: any}, params: IErrorParams): void => {
	const {statusCode, message} = params;
	ctx.status = statusCode;
	ctx.body = { message };
}
