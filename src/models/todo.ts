import {DataTypes, Model} from "sequelize";
import {sequelize} from "./index";

interface ITodo {
	id?: number;
	description: string;
	isDone?: boolean;
}

export class Todo extends Model<ITodo> implements ITodo {
	public id!: number;
	public description!: string;
	public isDone!: boolean;
}

Todo.init({
	id: {
		type: DataTypes.NUMBER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING(300),
		defaultValue: ''
	},
	isDone: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	}
}, {
	sequelize,
	tableName: 'todos'
});