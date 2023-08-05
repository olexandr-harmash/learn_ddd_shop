import { AppError } from "../../../shared/core/AppError";
import { Either, Result, left, right } from "../../../shared/core/Result";
import { UseCase } from "../../../shared/core/UseCase";
import { Shop, ShopProps } from "../domain/Shop";
import { ShopAddress } from "../domain/ShopAddress";
import { IShopRepository } from "../repositories/Shop";
import { CreateShopDTO } from "./CreateShopDTO";
import { CreateShopErrors } from "./CreateShopErrors";

type Response = Either<
    CreateShopErrors.ShopAlreadyExistError |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>

export class CreateShopUseCase implements UseCase<CreateShopDTO, Promise<Response>> {
    private ShopRepo: IShopRepository;

    constructor(ShopRepo: IShopRepository) {
        this.ShopRepo = ShopRepo;
    }

    public async execute(request: CreateShopDTO): Promise<Response> {
        let shop: Shop;
        let address: ShopAddress;

        try {
            const addressOrError = ShopAddress.create({ value: request.address });

            if (addressOrError.isFailure) {
                return left(addressOrError);
            }

            address = addressOrError.getValue() as ShopAddress;

            const shopProps: ShopProps = {
                address,
                //TODO check errors
                cordX: request.cordX,
                cordY: request.cordY,
            }

            const ShopOrError = Shop.create(shopProps);

            if (ShopOrError.isFailure) {
                return left(ShopOrError);
            }

            shop = ShopOrError.getValue() as Shop;

            await this.ShopRepo.save(shop);

            return right(Result.ok<void>())

        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}