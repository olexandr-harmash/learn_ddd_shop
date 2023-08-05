import express from 'express'
import { createShopController } from '../../useCases';

const ShopRouter = express.Router();

ShopRouter.post('/', (req, res) => createShopController.execute(req, res))

export { ShopRouter }