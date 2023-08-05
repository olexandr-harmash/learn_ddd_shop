import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { ColorId } from "./ColorId";
import { ItemId } from "./ItemId";
import { PropositionId } from "./PropositionId";
import { QuantityList } from "./QuantityList";
import { SizeId } from "./SizeId";

// Определение интерфейса для свойств объекта Proposition
interface PropositionProps {
    sizeId: SizeId;
    itemId: ItemId;
    colorId: ColorId;
    quantity?: QuantityList;
}

// Класс, представляющий Proposition
export class Proposition extends AggregateRoot<PropositionProps> {
    // Геттер для получения propositionId
    get propositionId(): PropositionId {
        return PropositionId.create(this._id).getValue() as PropositionId;
    }

    // Геттер для получения propositionId
    get quantity(): QuantityList {
        return this.props.quantity as QuantityList;
    }

    // Геттер для получения itemId
    get itemId(): ItemId {
        return this.props.itemId;
    }

    // Геттер для получения colorId
    get colorId(): ColorId {
        return this.props.colorId;
    }

    // Геттер для получения sizeId
    get sizeId(): SizeId {
        return this.props.sizeId;
    }

    // Приватный конструктор, создает экземпляр Proposition
    private constructor(props: PropositionProps, id?: UniqueEntityID) {
        super(props, id);
    }

    /**
     * Статический метод create используется для создания экземпляра класса Proposition.
     * @param props - Объект типа PropositionProps с обязательными свойствами sizeId, itemId и colorId.
     * @param id (опционально) - Уникальный идентификатор для создаваемого экземпляра Proposition.
     * @returns Результат типа Result<Proposition>. Если создание прошло успешно, содержит успешное значение экземпляра Proposition.
     *          В противном случае содержит ошибку, полученную при проверке свойств sizeId, itemId и colorId.
     */
    public static create(props: PropositionProps, id?: UniqueEntityID): Result<Proposition> {
        // Проверяем свойства sizeId, itemId и colorId на null или undefined с помощью Guard
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: props?.sizeId, argumentName: 'sizeId' },
            { argument: props?.itemId, argumentName: 'itemId' },
            { argument: props?.colorId, argumentName: 'colorId' },
        ]);

        // Если проверка проходит успешно, создаем новый экземпляр Proposition
        if (!propsResult.isSuccess) {
            return Result.fail<Proposition>(propsResult.getErrorValue());
        }

        // Создаем экземпляр Proposition с помощью приватного конструктора
        const proposition = new Proposition({ ...props }, id);

        const isNewProposition = !!id === false;

        if (isNewProposition) {
            //proposition.addDomainEvent(new PropositionWasCreated(proposition));
        }
        // Возвращаем успешный результат с экземпляром Proposition
        return Result.ok<Proposition>(proposition);
    }
}
