import models from "../../../shared/infra/database/sequelize/models";
import { CategoryRepositoryImpl } from "./sequilizeRepository/CategoryRepository";
import { FabricRepositoryImpl } from "./sequilizeRepository/FabricRepository";
import { ImagePathRepositoryImpl } from "./sequilizeRepository/ImagePathRepository";
import { ItemRepositoryImpl } from "./sequilizeRepository/ItemRepository";
import { PropositionRepositoryImpl } from "./sequilizeRepository/PropositionRepository";
import { QuantityRepositoryImpl } from "./sequilizeRepository/QuantityRepository";

const fabricRepositoryImpl = new FabricRepositoryImpl(models);
const imagePathRepositoryImpl = new ImagePathRepositoryImpl(models);
const itemRepositoryImpl = new ItemRepositoryImpl(models, imagePathRepositoryImpl, fabricRepositoryImpl);
const propositionRepositoryImpl = new PropositionRepositoryImpl(models);
const quantityRepositoryImpl = new QuantityRepositoryImpl(models);
const categoryRepositoryImpl = new CategoryRepositoryImpl(models);

export {
    quantityRepositoryImpl,
    propositionRepositoryImpl,
    imagePathRepositoryImpl,
    itemRepositoryImpl,
    categoryRepositoryImpl,
}