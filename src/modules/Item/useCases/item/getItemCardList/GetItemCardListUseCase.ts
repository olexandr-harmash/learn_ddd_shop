import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CategoryId } from "../../../domain/CategoryId";
import { ColorId } from "../../../domain/ColorId";
import { ItemList } from "../../../domain/ItemList";
import { SizeId } from "../../../domain/SizeId";
import { GetItemCardListFilters, IItemRepository } from "../../../repositories/Item";
import { ItemFiltersDTO } from "./GetItemCardListDTO";


type Response = Either<
    AppError.UnexpectedError |
    Result<any>,
    Result<ItemList>
>

export class GetItemCardListUseCase implements UseCase<ItemFiltersDTO, Promise<Response>> {
    private itemRepo: IItemRepository;

    constructor(itemRepo: IItemRepository) {
        this.itemRepo = itemRepo;
    }

    public async execute(request: ItemFiltersDTO): Promise<Response> {
        try {
            const itemFilters: GetItemCardListFilters = {
                categoryIds: request.categoryIds.map(i => CategoryId.create(new UniqueEntityID(i)).getValue() as CategoryId),
                price: request.price,
                sizeIds: request.sizeIds.map(i => SizeId.create(new UniqueEntityID(i)).getValue() as SizeId),
                colorIds: request.colorIds.map(i => ColorId.create(new UniqueEntityID(i)).getValue() as ColorId)
            }

            const itemList = await this.itemRepo.getItemCardList(itemFilters);

            return right(Result.ok<ItemList>(itemList))
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}