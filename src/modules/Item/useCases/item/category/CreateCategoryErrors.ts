import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";


export namespace CreateCategoryErrors {
  export class CategoryAlreadyExistError extends Result<UseCaseError> {
    constructor () {
      super(false, {
        message: `The item already exist.`
      } as UseCaseError)
    }
  }
}