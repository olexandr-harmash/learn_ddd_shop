
import { CreateQuantityErrors } from "./CreateQuantityErrors";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { UseCase } from "../../../../shared/core/UseCase";
import { IQuantityRepository } from "../../repositories/Quantity";
import { Quantity } from "../../domain/Quantity";
import { QuantityList } from "../../domain/QuantityList";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { PropositionId } from "../../domain/PropositionId";
import { CreateQuantityListDTO } from "./CreateQuantityDTO";
import { ShopId } from "../../../storage/domain/ShopId";

type Response = Either<
    CreateQuantityErrors.ItemDoesntExistError |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>

export class CreateQuantityUseCase implements UseCase<CreateQuantityListDTO, Promise<Response>> {
    private quantityRepo: IQuantityRepository;

    constructor(quantityRepo: IQuantityRepository) {
        this.quantityRepo = quantityRepo;
    }

    public async execute(request: CreateQuantityListDTO): Promise<Response> {
        let quantities: Quantity[];

        try {
            quantities = request.quantityList.map(q => {
                return Quantity.create({
                    shopId: ShopId.create(new UniqueEntityID(q.shopId)).getValue() as ShopId,
                    quantity: q.quantity,
                    propositionId: PropositionId.create(new UniqueEntityID(q.propositionId)).getValue() as PropositionId
                }).getValue() as Quantity;
            });

            const quantityList = QuantityList.create(quantities);
            
            await this.quantityRepo.saveList(quantityList);

            return right(Result.ok<void>());
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}