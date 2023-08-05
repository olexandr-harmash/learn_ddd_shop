import { CreatePropositionListDTO } from "./CreatePropositionDTO";
import { CreatePropositionErrors } from "./CreatePropositionErrors";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { UseCase } from "../../../../shared/core/UseCase";
import { IPropositionRepository } from "../../repositories/Proposition";
import { Proposition } from "../../domain/Proposition";
import { PropositionList } from "../../domain/PropositionList";
import { SizeId } from "../../domain/SizeId";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { ItemId } from "../../domain/ItemId";
import { ColorId } from "../../domain/ColorId";

type Response = Either<
    CreatePropositionErrors.ItemDoesntExistError |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>

export class CreatePropositionUseCase implements UseCase<CreatePropositionListDTO, Promise<Response>> {
    private propositionRepo: IPropositionRepository;

    constructor(propositionRepo: IPropositionRepository) {
        this.propositionRepo = propositionRepo;
    }

    public async execute(request: CreatePropositionListDTO): Promise<Response> {
        let propositions: Proposition[];

        try {

            propositions = request.propositionList.map(p => {
                return Proposition.create({
                    sizeId: SizeId.create(new UniqueEntityID(p.sizeId)).getValue() as SizeId,
                    itemId: ItemId.create(new UniqueEntityID(p.itemId)).getValue() as ItemId,
                    colorId: ColorId.create(new UniqueEntityID(p.colorId)).getValue() as ColorId
                }).getValue() as Proposition;
            });

            const propositionList = PropositionList.create(propositions);

            await this.propositionRepo.saveList(propositionList);

            return right(Result.ok<void>());
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}