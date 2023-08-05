import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

export class ShopAddress extends ValueObject<{ value: string }> {
    private static maxLength = 60;

    get value() {
        return this.props.value
    }
    
    public static create(props: { value: string }): Result<ShopAddress> {
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: props?.value, argumentName: 'value' },
        ]);

        if (propsResult.isFailure) {
            return Result.fail<ShopAddress>(propsResult.getErrorValue())
        }

        const guardResult = Guard.greaterThan(props.value.length, this.maxLength)

        if (guardResult.isFailure) {
            return Result.fail<ShopAddress>(guardResult.getErrorValue())
        }

        // Создаем экземпляр Shop с помощью приватного конструктора
        const shopDescription = new ShopAddress(props);

        // Возвращаем успешный результат с экземпляром Shop
        return Result.ok<ShopAddress>(shopDescription);
    }
}