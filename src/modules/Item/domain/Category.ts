import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";

import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { CategoryId } from "./CategoryId";

// Определение интерфейса для свойств объекта Category
export interface CategoryProps {
    parentCategoryId: CategoryId | null;
    category: string;
}

// Класс, представляющий Category
export class Category extends Entity<CategoryProps> {
    private static categorys = ['men', 'women', 'summer', 'winter', 'childs'];

    // Геттер для получения itemId
    get CategoryId(): CategoryId {
        return CategoryId.create(this._id).getValue() as CategoryId;
    }

    get category(): string {
        return this.props.category;
    }

    get parentCategoryId(): CategoryId | null {
        return this.props.parentCategoryId;
    }


    // Приватный конструктор, создает экземпляр Category
    private constructor(props: CategoryProps, id?: UniqueEntityID) {
        super(props, id);
    }

    /**
     * Статический метод create используется для создания экземпляра класса Category.
     * @param props - Объект типа CategoryProps с обязательными свойствами images и description.
     * @param id (опционально) - Уникальный идентификатор для создаваемого экземпляра Category.
     * @returns Результат типа Result<Category>. Если создание прошло успешно, содержит успешное значение экземпляра Category.
     *          В противном случае содержит ошибку, полученную при проверке свойств images и description.
     */
    public static create(props: CategoryProps, id?: UniqueEntityID): Result<Category> {
        // Проверяем свойства images и description на null или undefined с помощью Guard
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: props?.category, argumentName: 'categoty' },
        ]);

        // Если проверка проходит успешно, создаем новый экземпляр Item
        if (!propsResult.isSuccess) {
            return Result.fail<Category>(propsResult.getErrorValue());
        }

        // Создаем экземпляр Category с помощью приватного конструктора
        const category = new Category({ ...props }, id);

        // Возвращаем успешный результат с экземпляром Category
        return Result.ok<Category>(category);
    }
}
