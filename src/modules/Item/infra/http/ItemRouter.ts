import express from 'express'

import { createCategoryController, createItemController, getItemCardListController, getItemCardListPageController, getItemDetailController } from '../../useCases/item';

const ItemRouter = express.Router();

ItemRouter.get('/detail', (req, res) => getItemDetailController.execute(req, res))
ItemRouter.get('/card', (req, res) => getItemCardListController.execute(req, res));
ItemRouter.post('/', (req, res) => createItemController.execute(req, res));
ItemRouter.post('/category', (req, res) => createCategoryController.execute(req, res));

export { ItemRouter }