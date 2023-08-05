import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace CreateItemErrors {
  export class ItemAlreadyExistError extends Result<UseCaseError> {
    constructor () {
      super(false, {
        message: `The item already exist.`
      } as UseCaseError)
    }
  }
}