import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace CreateQuantityErrors {
  export class ItemDoesntExistError extends Result<UseCaseError> {
    constructor () {
      super(false, {
        message: `The proposition doesnt exist.`
      } as UseCaseError)
    }
  }
  
  export class QuantityAlreadyExistError extends Result<UseCaseError> {
    constructor () {
      super(false, {
        message: `The quantity already exist.`
      } as UseCaseError)
    }
  }
}
