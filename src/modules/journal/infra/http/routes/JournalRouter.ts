import express from 'express'

import {
    createJournalController
} from '../../../useCases/createJournal';

import {
    getJournalByIdController
} from '../../../useCases/getJournalById';

import { fetchJournalsByFilterController } from '../../../useCases/fetchJournalsByFilter';

const JournalRouter = express.Router();

JournalRouter.get('/', (req, res) => fetchJournalsByFilterController.execute(req, res))

JournalRouter.get('/:id', (req, res) => getJournalByIdController.execute(req, res))

JournalRouter.post('/', (req, res) => createJournalController.execute(req, res))

export { JournalRouter }