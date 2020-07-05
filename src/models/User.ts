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
import {ICreateLink, IGetLink, IRemoveLink, IUpdateLink} from "../types/links";

interface IUserLinks {
	getSelf: IGetLink;
	updateSelf: IUpdateLink;
	removeSelf: IRemoveLink;
	getTodos: IGetLink;
	addTodo: ICreateLink;
}

interface IUser {
	id: number;
	name: string;
	_links: IUserLinks;
}

type TUserCreation = Optional<IUser, 'id' | '_links'>;

export class User extends Model<IUser, TUserCreation> implements IUser {
	public readonly id!: number;
	public name!: string;
	public readonly _links!: IUserLinks;

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
	_links: {
		type: DataTypes.VIRTUAL,
		get(): IUserLinks {
			return {
				getSelf: {
					method: 'GET',
					link: `/users/${this.id}`
				},
				updateSelf: {
					method: 'PATCH',
					link: `/users/${this.id}`
				},
				removeSelf: {
					method: 'DELETE',
					link: `/users/${this.id}`
				},
				getTodos: {
					method: 'GET',
					link: `/users/${this.id}/todos`
				},
				addTodo: {
					method: 'POST',
					link: `/users/${this.id}/todos`
				}
			}
		}
	}
}, {
	sequelize,
	tableName: 'users'
});

User.hasMany(Todo, {
	sourceKey: 'id',
	foreignKey: 'userId',
	as: 'todos',
});