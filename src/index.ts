// Infra

import "./shared/infra/http/app"

import dbInit from "./shared/infra/database/sequelize"

dbInit().catch(err => console.error(err))