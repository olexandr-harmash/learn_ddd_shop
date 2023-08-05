import models from "../../../shared/infra/database/sequelize/models";

import { ShopRepositoryImpl } from "./sequilizeRepository/ShopRepository";

const shopRepositoryImpl = new ShopRepositoryImpl(models);

export {
    shopRepositoryImpl
}