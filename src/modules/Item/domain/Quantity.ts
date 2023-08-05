import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

import { ItemId } from "./ItemId";
import { PropositionId } from "./PropositionId";
import { QuantityId } from "./QuantityId";
import { ShopId } from "../../storage/domain/ShopId";

// Определение интерфейса для свойств объекта Quantity
interface QuantityProps {
    shopId: ShopId;
    quantity: number;
    propositionId: PropositionId;
}

// Класс, представляющий Quantity
export class Quantity extends AggregateRoot<QuantityProps> {
    private static minQuantity = 0;

    // Геттер для получения itemId
    get quantityId(): QuantityId {
        return QuantityId.create(this._id).getValue() as QuantityId;
    }

    get shopId(): ShopId {
        return this.props.shopId;
    }

    get quantity(): number {
        return this.props.quantity;
    }

    // Геттер для получения description
    get propositionId(): PropositionId {
        return this.props.propositionId;
    }

    // Приватный конструктор, создает экземпляр Quantity
    private constructor(props: QuantityProps, id?: UniqueEntityID) {
        super(props, id);
    }

    /**
     * Статический метод create используется для создания экземпляра класса Quantity.
     * @param props - Объект типа QuantityProps с обязательными свойствами images и description.
     * @param id (опционально) - Уникальный идентификатор для создаваемого экземпляра Quantity.
     * @returns Результат типа Result<Quantity>. Если создание прошло успешно, содержит успешное значение экземпляра Quantity.
     *          В противном случае содержит ошибку, полученную при проверке свойств images и description.
     */
    public static create(props: QuantityProps, id?: UniqueEntityID): Result<Quantity> {
        // Проверяем свойства images и description на null или undefined с помощью Guard
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: props?.shopId, argumentName: 'shop_id' },
            { argument: props?.quantity, argumentName: 'quantity' },
            { argument: props?.propositionId, argumentName: 'proposition_id' },
        ]);

        // Если проверка проходит успешно, создаем новый экземпляр Quantity
        if (!propsResult.isSuccess) {
            return Result.fail<Quantity>(propsResult.getErrorValue());
        }

        const guardResult = Guard.greaterThan(this.minQuantity, props.quantity)

        if (guardResult.isFailure) {
            return Result.fail<Quantity>(`Length must be less than ${this.minQuantity} symbols`)
        }

        // Создаем экземпляр Quantity с помощью приватного конструктора
        const item = new Quantity({ ...props }, id);

        // Возвращаем успешный результат с экземпляром Quantity
        return Result.ok<Quantity>(item);
    }
}
