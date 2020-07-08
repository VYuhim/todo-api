import { DataTypes, Model, Optional} from 'sequelize';
import { sequelize } from './index';
import {IGetLink, IRemoveLink, IUpdateLink} from "../types/links";


interface ITodoLinks {
  getSelf: IGetLink;
  updateSelf: IUpdateLink;
  removeSelf: IRemoveLink;
  getOwner: IGetLink;
}

interface ITodo {
  id: number;
  owner: string;
  description: string;
  isDone?: boolean;
  _links: ITodoLinks;
}

type TTodoCreation = Optional<ITodo, 'id' | 'isDone' | '_links'>;

export class Todo extends Model<ITodo, TTodoCreation> implements ITodo {
  public readonly id!: number;
  public readonly owner!: string;
  public description!: string;
  public isDone!: boolean;
  public readonly _links!: ITodoLinks;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    owner: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(300),
      defaultValue: '',
    },
    isDone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    _links: {
      type: DataTypes.VIRTUAL,
      get(): ITodoLinks {
        return {
          getSelf: {
            method: 'GET',
            link: `/todos/${this.id}`
          },
          updateSelf: {
            method: 'PATCH',
            link: `/todos/${this.id}`
          },
          removeSelf: {
            method: 'DELETE',
            link: `/todos/${this.id}`
          },
          getOwner: {
            method: 'GET',
            link: `/users/${this.owner}`
          }
        }
      }
    }
  },
  {
    sequelize,
    tableName: 'todos',
  },
);
