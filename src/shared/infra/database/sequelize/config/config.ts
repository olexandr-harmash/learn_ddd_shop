import 'dotenv/config'

import {
  Dialect,
  Sequelize
} from 'sequelize'

const {
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_DEV_DB_NAME,
  DB_PROD_DB_NAME,
  NODE_ENV,
  DB_DRIVER
} = process.env

const isTest = NODE_ENV === 'test'

const dbName = isTest ? DB_DEV_DB_NAME as string : DB_PROD_DB_NAME as string
const dbUser = DB_USER as string
const dbHost = DB_HOST
const dbDriver = DB_DRIVER as Dialect
const dbPassword = DB_PASS

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
  logging: false,
})

export default sequelizeConnection