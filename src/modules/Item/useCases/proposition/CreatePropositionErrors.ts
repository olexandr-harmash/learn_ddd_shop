import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace CreatePropositionErrors {
  export class ItemDoesntExistError extends Result<UseCaseError> {
    constructor () {
      super(false, {
        message: `The item doesnt exist.`
      } as UseCaseError)
    }
  }
  
  export class PropositionAlreadyExistError extends Result<UseCaseError> {
    constructor () {
      super(false, {
        message: `The proposition already exist.`
      } as UseCaseError)
    }
  }
}
