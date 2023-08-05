import { Category } from "../domain/Category"
import { CategoryId } from "../domain/CategoryId"
import { CategoryList } from "../domain/CategoryList"
import { ItemId } from "../domain/ItemId"

export interface ICategoryRepository {
    save(item: Category): Promise<Category>
    exists(id: CategoryId): Promise<boolean>
    getSubCategoryListById(id: CategoryId): Promise<CategoryList>
    delete(categoryId: CategoryId): Promise<void>
}