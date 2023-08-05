
import { ItemDescription } from "../../../domain/ItemDescription";

import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { UseCase } from "../../../../../shared/core/UseCase";
import { IItemRepository } from "../../../repositories/Item";
import { Item, ItemProps } from "../../../domain/Item";
import { ImagePathList } from "../../../domain/ImagePathList";
import { ImagePath } from "../../../domain/ImagePath";
import { Fabric } from "../../../domain/Fabric";
import { GetItemDetailErrors } from "./GetItemDetalError";
import { GetItemDetailDTO } from "./GetItemDetalDTO";
import { ItemId } from "../../../domain/ItemId";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";

type Response = Either<
    GetItemDetailErrors.ItemAlreadyExistError |
    AppError.UnexpectedError |
    Result<any>,
    Result<Item>
>

export class GetItemDetailUseCase implements UseCase<GetItemDetailDTO, Promise<Response>> {
    private itemRepo: IItemRepository;

    constructor(itemRepo: IItemRepository) {
        this.itemRepo = itemRepo;
    }

    public async execute(request: GetItemDetailDTO): Promise<Response> {
        let itemId: ItemId;

        try {
            const itemIdOrError = ItemId.create(new UniqueEntityID(request.itemId));

            if (itemIdOrError.getErrorValue()) {
                return left(itemIdOrError);
            }

            itemId = itemIdOrError.getValue() as ItemId;

            const itemDetails = await this.itemRepo.getItemDetail(itemId);

            return right(Result.ok<Item>(itemDetails))

        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}