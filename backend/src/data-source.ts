import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'yourpassword',
  database: 'TaskSmithDB',
  synchronize: false,
  logging: false,
  entities: ['./src/**/entities/*.ts'],
  migrations: ['./src/migrations/*.ts'],
});
