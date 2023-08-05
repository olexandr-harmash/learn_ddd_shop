import express from 'express'

import { createQuantityController } from '../../useCases/quantity';

const QuantityRouter = express.Router();

QuantityRouter.post('/', (req, res) => createQuantityController.execute(req, res))

export { QuantityRouter }