import { categoryRepositoryImpl, itemRepositoryImpl } from "../../repositories";
import { CreateCategoryController } from "./category/CreateCategoryController";
import { CreateCategoryUseCase } from "./category/CreateCategoryUseCase";
import { CreateItemController } from "./createItem/CreateItemController"
import { CreateItemUseCase } from "./createItem/CreateItemUseCase"
import { GetItemCardListController } from "./getItemCardList/GetItemCardListController";
import { GetItemCardListPageController } from "./getItemCardList/GetItemCardListPageController";
import { GetItemCardListUseCase } from "./getItemCardList/GetItemCardListUseCase";
import { GetItemDetailController } from "./getItemDetail/GetItemDetalController";
import { GetItemDetailUseCase } from "./getItemDetail/GetItemDetalUseCase";

const createItemUseCase = new CreateItemUseCase(itemRepositoryImpl);
const createItemController = new CreateItemController(createItemUseCase);

const getItemCardListUseCase = new GetItemCardListUseCase(itemRepositoryImpl);
const getItemCardListController = new GetItemCardListController(getItemCardListUseCase);
const getItemCardListPageController = new GetItemCardListPageController(getItemCardListUseCase);

const getItemDetailUseCase = new GetItemDetailUseCase(itemRepositoryImpl);
const getItemDetailController = new GetItemDetailController(getItemDetailUseCase);

const createCategoryUseCase = new CreateCategoryUseCase(categoryRepositoryImpl);
const createCategoryController = new CreateCategoryController(createCategoryUseCase);

export {
    createItemUseCase,
    createItemController,
    getItemCardListUseCase,
    getItemCardListController,
    getItemCardListPageController,
    getItemDetailController,
    getItemDetailUseCase,
    createCategoryController,
}