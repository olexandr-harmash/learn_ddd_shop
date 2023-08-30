import express from 'express'

import { createCategoryController, createItemController, getItemCardListController, getItemCardListPageController, getItemDetailController } from '../../useCases/item';

const StaticRouter = express.Router();

StaticRouter.get('/:type/catalog', (req, res) => getItemCardListPageController.execute(req, res));

export { StaticRouter }