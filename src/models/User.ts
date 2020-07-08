import {
	Model,
	DataTypes,
	Optional,
	HasManyGetAssociationsMixin,
	HasManyCreateAssociationMixin,
	Association,
} from "sequelize";
import {Todo} from "./Todo";
import {sequelize} from "./index";
import {ICreateLink, IGetLink, IRemoveLink, IUpdateLink} from "../types/links";
import bcrypt from 'bcrypt';

interface IUserLinks {
	getSelf: IGetLink;
	updateSelf: IUpdateLink;
	removeSelf: IRemoveLink;
	getTodos: IGetLink;
	addTodo: ICreateLink;
}

interface IUser {
	email: string;
	login: string;
	password: string;
	_links: IUserLinks;
}

type TUserCreation = Optional<IUser, '_links'>;

export class User extends Model<IUser, TUserCreation> implements IUser {
	public readonly id!: number;
	public email!: string;
	public login!: string;
	public password!: string;
	public readonly _links!: IUserLinks;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public createTodo!: HasManyCreateAssociationMixin<Todo>;

	public readonly todos?: Todo[];
	public static assotiations: {
		todos: Association<User, Todo>;
	}
}

User.init({
	login: {
		type: new DataTypes.STRING(128),
		unique: true,
		primaryKey: true,
		allowNull: false,
		validate: {
			notEmpty: true,
			not: /\s/gm,
		}
	},
	email: {
		type: new DataTypes.STRING(128),
		unique: true,
		allowNull: false,
		validate: {
			isEmail: true,
		},
		set(val: string) {
			this.setDataValue('email', val.toLowerCase());
		},
	},
	password: {
		type: new DataTypes.STRING(128),
		allowNull: false,
	},
	_links: {
		type: DataTypes.VIRTUAL,
		get(): IUserLinks {
			return {
				getSelf: {
					method: 'GET',
					link: `/users/${this.login}`
				},
				updateSelf: {
					method: 'PATCH',
					link: `/users/${this.login}`
				},
				removeSelf: {
					method: 'DELETE',
					link: `/users/${this.login}`
				},
				getTodos: {
					method: 'GET',
					link: `/users/${this.login}/todos`
				},
				addTodo: {
					method: 'POST',
					link: `/users/${this.login}/todos`
				}
			}
		}
	}
}, {
	sequelize,
	tableName: 'users'
});

User.hasMany(Todo, {
	sourceKey: 'login',
	foreignKey: 'owner',
	as: 'todos',
});