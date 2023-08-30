// Infra

import "./shared/infra/http/"

import dbInit from "./shared/infra/database/sequelize"

dbInit().catch(err => console.error(err))