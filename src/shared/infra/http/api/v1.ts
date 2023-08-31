import express from 'express'
import { ItemRouter } from '../../../../modules/Item/infra/http/ItemRouter';
import { PropositionRouter } from '../../../../modules/Item/infra/http/PropositionRouter';
import { QuantityRouter } from '../../../../modules/Item/infra/http/QuantityRouter';
import { ShopRouter } from '../../../../modules/storage/infra/http/ShopRouter';
import { StaticRouter } from '../../../../modules/Item/infra/http/StaticRouter';

const v1Router = express.Router();
const v1StaticRouter = express.Router();

v1Router.use('/item', ItemRouter);
v1Router.use('/quantity', QuantityRouter);
v1Router.use('/proposition', PropositionRouter);
v1Router.use('/storage', ShopRouter);

v1StaticRouter.use('/', StaticRouter);

export { v1Router, v1StaticRouter }