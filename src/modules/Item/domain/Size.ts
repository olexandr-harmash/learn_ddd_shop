import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";

import { SizeId } from "./SizeId";
import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

// Определение интерфейса для свойств объекта Size
interface SizeProps {
    value: string;
}

// Класс, представляющий Size
export class Size extends Entity<SizeProps> {
    private static sizes = ['X', 'XL', 'XXL', 'S', 'L'];

    // Геттер для получения itemId
    get SizeId(): SizeId {
        return SizeId.create(this._id).getValue() as SizeId;
    }

    get value(): string {
        return this.props.value;
    }


    // Приватный конструктор, создает экземпляр Size
    private constructor(props: SizeProps, id?: UniqueEntityID) {
        super(props, id);
    }

    /**
     * Статический метод create используется для создания экземпляра класса Size.
     * @param props - Объект типа SizeProps с обязательными свойствами images и description.
     * @param id (опционально) - Уникальный идентификатор для создаваемого экземпляра Size.
     * @returns Результат типа Result<Size>. Если создание прошло успешно, содержит успешное значение экземпляра Size.
     *          В противном случае содержит ошибку, полученную при проверке свойств images и description.
     */
    public static create(props: SizeProps, id?: UniqueEntityID): Result<Size> {
        // Проверяем свойства images и description на null или undefined с помощью Guard
        const propsResult = Guard.isOneOf(props.value, this.sizes, 'value');

        // Если проверка проходит успешно, создаем новый экземпляр Quantity
        if (!propsResult.isSuccess) {
            return Result.fail<Size>(propsResult.getErrorValue());
        }

        // Создаем экземпляр Size с помощью приватного конструктора
        const size = new Size({ ...props }, id);

        // Возвращаем успешный результат с экземпляром Size
        return Result.ok<Size>(size);
    }
}
