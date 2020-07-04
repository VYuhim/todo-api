import { DataTypes, Model, Association, Optional} from 'sequelize';
import { sequelize } from './index';

interface ITodo {
  id: number;
  userId: number;
  description: string;
  isDone?: boolean;
}

type TTodoCreation = Optional<ITodo, 'id' | 'isDone'>;

export class Todo extends Model<ITodo, TTodoCreation> implements ITodo {
  public id!: number;
  public userId!: number;
  public description!: string;
  public isDone!: boolean;

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
    userId: {
      type: DataTypes.INTEGER,
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
  },
  {
    sequelize,
    tableName: 'todos',
  },
);
