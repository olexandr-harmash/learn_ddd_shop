import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Category, CategoryProps } from "../../../domain/Category";
import { CategoryId } from "../../../domain/CategoryId";
import { ICategoryRepository } from "../../../repositories/Category";
import { CreateCategoryDTO } from "./CreateCategoryDTO";
import { CreateCategoryErrors } from "./CreateCategoryErrors";


type Response = Either<
    CreateCategoryErrors.CategoryAlreadyExistError |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>

export class CreateCategoryUseCase implements UseCase<CreateCategoryDTO, Promise<Response>> {
    private categoryRepo: ICategoryRepository;

    constructor(categoryRepo: ICategoryRepository) {
        this.categoryRepo = categoryRepo;
    }

    public async execute(request: CreateCategoryDTO): Promise<Response> {
        let category: Category;
        
        try {
            const categoryProps: CategoryProps = {
                parentCategoryId: request.parentCategoryId ? CategoryId.create(new UniqueEntityID(request.parentCategoryId)).getValue() as CategoryId : null,
                category: request.category,
            }

            const categoryOrError = Category.create(categoryProps);

            if (categoryOrError.isFailure) {
                return left(categoryOrError);
            }

            category = categoryOrError.getValue() as Category;

            await this.categoryRepo.save(category);

            return right(Result.ok<void>())

        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}