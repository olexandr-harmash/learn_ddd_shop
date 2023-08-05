import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";

import { FabricId } from "./FabricId";
import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

// Определение интерфейса для свойств объекта Fabric
interface FabricProps {
    cotton: number;
    poliester: number;
}

// Класс, представляющий Fabric
export class Fabric extends Entity<FabricProps> {
    // Геттер для получения itemId
    get FabricId(): FabricId {
        return FabricId.create(this._id).getValue() as FabricId;
    }

    get cotton(): number {
        return this.props.cotton;
    }

    get poliester(): number {
        return this.props.poliester;
    }


    // Приватный конструктор, создает экземпляр Fabric
    private constructor(props: FabricProps, id?: UniqueEntityID) {
        super(props, id);
    }

    /**
     * Статический метод create используется для создания экземпляра класса Fabric.
     * @param props - Объект типа FabricProps с обязательными свойствами images и description.
     * @param id (опционально) - Уникальный идентификатор для создаваемого экземпляра Fabric.
     * @returns Результат типа Result<Fabric>. Если создание прошло успешно, содержит успешное значение экземпляра Fabric.
     *          В противном случае содержит ошибку, полученную при проверке свойств images и description.
     */
    public static create(props: FabricProps, id?: UniqueEntityID): Result<Fabric> {
        // Проверяем свойства images и description на null или undefined с помощью Guard
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: props?.cotton, argumentName: 'cotton' },
            { argument: props?.poliester, argumentName: 'poliester' },
        ]);
        // Если проверка проходит успешно, создаем новый экземпляр Quantity
        if (!propsResult.isSuccess) {
            return Result.fail<Fabric>(propsResult.getErrorValue());
        }

        // Создаем экземпляр Fabric с помощью приватного конструктора
        const fabric = new Fabric({ ...props }, id);

        // Возвращаем успешный результат с экземпляром Fabric
        return Result.ok<Fabric>(fabric);
    }
}
