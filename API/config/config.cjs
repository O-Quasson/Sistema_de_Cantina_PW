require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });

const useSqlite = process.env.DB_DIALECT === 'sqlite';

module.exports = {
  development: useSqlite
    ? {
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE || './database.sqlite'
      }
    : {
        dialect: 'postgres',
        url: process.env.DATABASE_URL,
        dialectOptions: process.env.DATABASE_SSL === 'true' ? { ssl: { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' } } : undefined
      },
  test: {
    dialect: 'sqlite',
    storage: ':memory:'
  },
  production: {
    dialect: 'postgres',
    url: process.env.DATABASE_URL,
    dialectOptions: process.env.DATABASE_SSL === 'true' ? { ssl: { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' } } : undefined
  }
};
