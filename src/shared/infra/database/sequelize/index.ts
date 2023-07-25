import 'dotenv/config'

import models from './models'

import sequelizeConnection from './config/config'

export { sequelizeConnection }

const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

const dbInit = async () => {
    Object.keys(models).forEach(async (modelName: string) => {
        const key = modelName as keyof typeof models

        models[key]?.associate(models)

        await models[key].sync({ alter: isDev || isTest })
    })
}

export default dbInit