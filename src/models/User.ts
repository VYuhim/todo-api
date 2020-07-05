import {
	Model,
	DataTypes,
	Optional,
	HasManyGetAssociationsMixin,
	HasManyAddAssociationMixin,
	HasManyCreateAssociationMixin,
	Association,
	HasManyGetAssociationsMixinOptions
} from "sequelize";
import {Todo} from "./Todo";
import {sequelize} from "./index";

interface IUser {
	id: number;
	name: string;
}

type TUserCreation = Optional<IUser, 'id'>;

export class User extends Model<IUser, TUserCreation> implements IUser {
	public id!: number;
	public name!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public getTodos!: HasManyGetAssociationsMixin<Todo>;
	public createTodo!: HasManyCreateAssociationMixin<Todo>;

	public readonly todos?: Todo[];
	public static assotiations: {
		todos: Association<User, Todo>;
	}
}

User.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: new DataTypes.STRING(128),
		allowNull: false,
	},
}, {
	sequelize,
	tableName: 'users'
});

User.hasMany(Todo, {
	sourceKey: 'id',
	foreignKey: 'userId',
	as: 'todos',
});
Todo.belongsTo(User);