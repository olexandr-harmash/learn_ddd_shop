
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

export class FabricId extends ValueObject<{ value: UniqueEntityID }> {

  getStringValue (): string {
    return this.props.value.toString();
  }

  getValue (): UniqueEntityID {
    return this.props.value;
  }

  private constructor (value: UniqueEntityID) {
    super({ value });
  }

  public static create (value: UniqueEntityID): Result<FabricId> {
    let guardResult = Guard.againstNullOrUndefined(value, 'value');
    if (guardResult.isFailure) {
      return Result.fail<FabricId>(guardResult.getErrorValue())
    }
    return Result.ok<FabricId>(new FabricId(value));
  }
}