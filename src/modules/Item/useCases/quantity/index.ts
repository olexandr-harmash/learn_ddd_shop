import { quantityRepositoryImpl } from "../../repositories";
import { CreateQuantityController } from "./CreateQuantityController";
import { CreateQuantityUseCase } from "./CreateQuantityUseCase";

const createQuantityUseCase = new CreateQuantityUseCase(quantityRepositoryImpl);
const createQuantityController = new CreateQuantityController(createQuantityUseCase);

export {
    createQuantityUseCase,
    createQuantityController
}