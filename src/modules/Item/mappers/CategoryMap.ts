import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/infra/Mapper";
import { Category } from "../domain/Category";
import { CategoryId } from "../domain/CategoryId";


export class CategoryMap implements Mapper<Category> {
    public static toPersistence(category: Category): any {
        return {
            category_id: category.CategoryId.getStringValue(),
            parent_category_id: category.parentCategoryId ? category.CategoryId.getStringValue() : null,
            category: category.category,
        }
    }

    public static toDomain(raw: any): Category | null {
        const itemOrError = Category.create({
            category: raw.category,
            parentCategoryId: raw.parent_category_id ? CategoryId.create(new UniqueEntityID(raw.parent_category_id)).getValue() as CategoryId : null,
        }, new UniqueEntityID(raw.category_id));

        itemOrError.isFailure ? console.log(itemOrError.getErrorValue()) : '';

        return itemOrError.isSuccess ? itemOrError.getValue() as Category : null;
    }
}