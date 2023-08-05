import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";

import { ColorId } from "./ColorId";
import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

// Определение интерфейса для свойств объекта Color
interface ColorProps {
    value: string;
}

// Класс, представляющий Color
export class Color extends Entity<ColorProps> {
    private static colors = ['yellow', 'black', 'white', 'blue', 'red', 'pink'];

    // Геттер для получения itemId
    get ColorId(): ColorId {
        return ColorId.create(this._id).getValue() as ColorId;
    }

    get value(): string {
        return this.props.value;
    }


    // Приватный конструктор, создает экземпляр Color
    private constructor(props: ColorProps, id?: UniqueEntityID) {
        super(props, id);
    }

    /**
     * Статический метод create используется для создания экземпляра класса Color.
     * @param props - Объект типа ColorProps с обязательными свойствами images и description.
     * @param id (опционально) - Уникальный идентификатор для создаваемого экземпляра Color.
     * @returns Результат типа Result<Color>. Если создание прошло успешно, содержит успешное значение экземпляра Color.
     *          В противном случае содержит ошибку, полученную при проверке свойств images и description.
     */
    public static create(props: ColorProps, id?: UniqueEntityID): Result<Color> {
        // Проверяем свойства images и description на null или undefined с помощью Guard
        const propsResult = Guard.isOneOf(props.value, this.colors, 'value');

        // Если проверка проходит успешно, создаем новый экземпляр Quantity
        if (!propsResult.isSuccess) {
            return Result.fail<Color>(propsResult.getErrorValue());
        }

        // Создаем экземпляр Color с помощью приватного конструктора
        const color = new Color({ ...props }, id);

        // Возвращаем успешный результат с экземпляром Color
        return Result.ok<Color>(color);
    }
}
