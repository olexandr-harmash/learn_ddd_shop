import { shopRepositoryImpl } from "../repositories";
import { CreateShopController } from "./CreateShopController";
import { CreateShopUseCase } from "./CreateShopUseCase";

const createShopUseCase = new CreateShopUseCase(shopRepositoryImpl);
const createShopController = new CreateShopController(createShopUseCase);

export {
    createShopUseCase,
    createShopController
}