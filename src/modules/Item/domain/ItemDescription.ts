import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

export class ItemDescription extends ValueObject<{ value: string }> {
    private static maxLength = 60;

    get value() {
        return this.props.value
    }
    
    public static create(props: { value: string }): Result<ItemDescription> {
        const guardResult = Guard.greaterThan(props.value.length, this.maxLength)

        if (guardResult.isFailure) {
            return Result.fail<ItemDescription>(`Length must be less than ${this.maxLength} symbols`)
        }

        // Создаем экземпляр Item с помощью приватного конструктора
        const itemDescription = new ItemDescription(props);

        // Возвращаем успешный результат с экземпляром Item
        return Result.ok<ItemDescription>(itemDescription);
    }
}