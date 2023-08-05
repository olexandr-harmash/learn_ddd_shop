import { CreateItemDTO } from "./CreateItemDTO";
import { ItemDescription } from "../../../domain/ItemDescription";
import { CreateItemErrors } from "./CreateItemErrors";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { UseCase } from "../../../../../shared/core/UseCase";
import { IItemRepository } from "../../../repositories/Item";
import { Item, ItemProps } from "../../../domain/Item";
import { ImagePathList } from "../../../domain/ImagePathList";
import { ImagePath } from "../../../domain/ImagePath";
import { Fabric } from "../../../domain/Fabric";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CategoryId } from "../../../domain/CategoryId";

type Response = Either<
    CreateItemErrors.ItemAlreadyExistError |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>

export class CreateItemUseCase implements UseCase<CreateItemDTO, Promise<Response>> {
    private itemRepo: IItemRepository;

    constructor(itemRepo: IItemRepository) {
        this.itemRepo = itemRepo;
    }

    public async execute(request: CreateItemDTO): Promise<Response> {
        let item: Item;
        let fabric: Fabric;
        let description: ItemDescription;
        
        try {
            const descriptionOrError = ItemDescription.create({ value: request.description });

            if (descriptionOrError.isFailure) {
                return left(descriptionOrError);
            }

            description = descriptionOrError.getValue() as ItemDescription;

            /**
             * TODO fs interface and make adapter for request.files into controller
             */
            const pathList = Object.keys(request.files).map(key => {
                // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
                const sampleFile = request.files[key];
                const uploadPath = `./static/${sampleFile.name}`;
                sampleFile.mv(uploadPath);
                return uploadPath;
            });
            
            const fabricOrError = Fabric.create({cotton: request.cotton, poliester: request.poliester});
            
            if (fabricOrError.isFailure) {
                return left(fabricOrError);
            }

            fabric = fabricOrError.getValue() as Fabric;
            
            const itemProps: ItemProps = {
                categoryId: CategoryId.create(new UniqueEntityID(request.categoryId)).getValue() as CategoryId,
                fabric,
                description,
                title: request.title,
                price: request.price,
                sale: request.sale,
                titleImagePath: pathList[0],
                //TODO check errors
                imagePathList: ImagePathList.create(pathList.map(path => ImagePath.create({ filePath: path }).getValue() as ImagePath)),
            }

            const itemOrError = Item.create(itemProps);

            if (itemOrError.isFailure) {
                return left(itemOrError);
            }

            item = itemOrError.getValue() as Item;

            await this.itemRepo.save(item);

            return right(Result.ok<void>())

        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}