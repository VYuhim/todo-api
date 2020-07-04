import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './base.sqlite',
});

export * from './Todo';
export * from './User';
