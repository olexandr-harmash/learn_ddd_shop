import express from 'express'
import { createPropositionController } from '../../useCases/proposition';

const PropositionRouter = express.Router();

PropositionRouter.post('/', (req, res) => createPropositionController.execute(req, res))

export { PropositionRouter }