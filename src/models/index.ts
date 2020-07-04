import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './base.sqlite',
  logging: false,
});

export * from './todo';
