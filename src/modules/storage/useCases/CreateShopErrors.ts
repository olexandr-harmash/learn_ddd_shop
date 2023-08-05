import { Result } from "../../../shared/core/Result";
import { UseCaseError } from "../../../shared/core/UseCaseError";

export namespace CreateShopErrors {
  export class ShopAlreadyExistError extends Result<UseCaseError> {
    constructor () {
      super(false, {
        message: `The shop already exist.`
      } as UseCaseError)
    }
  }
}