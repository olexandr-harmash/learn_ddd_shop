import express from 'express'

import {
  JournalRouter
} from '../../../../modules/journal/infra/http/routes';

const v1Router = express.Router();

v1Router.use('/journals', JournalRouter)

export { v1Router }