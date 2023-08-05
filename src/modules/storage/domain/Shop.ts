import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";

import { ShopId } from "./ShopId";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { ShopAddress } from "./ShopAddress";

// Определение интерфейса для свойств объекта Shop
export interface ShopProps {
    address: ShopAddress;
    cordX: number;
    cordY: number;
}

// Класс, представляющий Shop
export class Shop extends AggregateRoot<ShopProps> {
    // Геттер для получения itemId
    get ShopId(): ShopId {
        return ShopId.create(this._id).getValue() as ShopId;
    }

    get address(): ShopAddress {
        return this.props.address;
    }

    get cordX(): number {
        return this.props.cordX;
    }

    get cordY(): number {
        return this.props.cordY;
    }

    // Приватный конструктор, создает экземпляр Shop
    private constructor(props: ShopProps, id?: UniqueEntityID) {
        super(props, id);
    }

    /**
     * Статический метод create используется для создания экземпляра класса Shop.
     * @param props - Объект типа ShopProps с обязательными свойствами images и description.
     * @param id (опционально) - Уникальный идентификатор для создаваемого экземпляра Shop.
     * @returns Результат типа Result<Shop>. Если создание прошло успешно, содержит успешное значение экземпляра Shop.
     *          В противном случае содержит ошибку, полученную при проверке свойств images и description.
     */
    public static create(props: ShopProps, id?: UniqueEntityID): Result<Shop> {
        // Проверяем свойства images и description на null или undefined с помощью Guard
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: props?.address, argumentName: 'address' },
            { argument: props?.cordX, argumentName: 'cord_x' },
            { argument: props?.cordY, argumentName: 'cord_y' },
        ]);
        // Если проверка проходит успешно, создаем новый экземпляр Quantity
        if (!propsResult.isSuccess) {
            return Result.fail<Shop>(propsResult.getErrorValue());
        }

        // Создаем экземпляр Shop с помощью приватного конструктора
        const shop = new Shop({ ...props }, id);

        // Возвращаем успешный результат с экземпляром Shop
        return Result.ok<Shop>(shop);
    }
}
