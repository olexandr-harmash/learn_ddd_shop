import { Category } from "../../domain/Category";
import { CategoryId } from "../../domain/CategoryId";
import { ICategoryRepository } from "../Category";
import { ItemId } from "../../domain/ItemId";
import { CategoryList } from "../../domain/CategoryList";
import { CategoryMap } from "../../mappers/CategoryMap";
import { sequelizeConnection } from "../../../../shared/infra/database/sequelize";

export class CategoryRepositoryImpl implements ICategoryRepository {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async getSubCategoryListById(id: CategoryId): Promise<CategoryList> {
        const categoryListResult = await sequelizeConnection.query(
            `WITH RECURSIVE categoryList AS (
                SELECT category, parent_category_id
                FROM category
                WHERE category = ${id.getStringValue()}
             UNION ALL
                SELECT category.category, category.parent_category_id
                FROM category
                   JOIN categoryList ON category.parent_category_id = categoryList.category_id
            )
            SELECT * FROM categoryList;`
        );

        return CategoryList.create(categoryListResult.map((i: any) => CategoryMap.toDomain(i) as Category));
    }

    private createBaseQuery(limit?: number, offset?: number): any {
        const models = this.models;
        return {
            where: {},
            include: [],
            limit,
            offset
        }
    }

    private createBaseDetailsQuery(limit?: number, offset?: number): any {
        const models = this.models;
        return {
            where: {},
            include: [
            ],
            limit,
            offset
        }
    }

    public async exists(categoryId: CategoryId): Promise<boolean> {
        const CategoryModel = this.models.Category;
        const baseQuery = this.createBaseQuery();
        baseQuery.where['category_id'] = categoryId.getStringValue();
        const category = await CategoryModel.findOne(baseQuery);
        const found = !!category === true;
        return found;
    }

    public delete(categoryId: CategoryId): Promise<void> {
        const CategoryModel = this.models.Category;
        return CategoryModel.destroy({ where: { category_id: categoryId.getStringValue() } });
    }

    /**
     * TODO `Result` interface adaptive error throwing
     */
    public async save(category: Category): Promise<Category> {
        const CategoryModel = this.models.Category;
        const exists = await this.exists(category.CategoryId);
        const isNewCategory = !exists;
        const rawSequelizeCategory = await CategoryMap.toPersistence(category);

        if (isNewCategory) {
            const categoryResult = await CategoryModel.create(rawSequelizeCategory);

            return category;
        } else {
            // Save non-aggregate tables before saving the aggregate
            // so that any domain events on the aggregate get dispatched

            const categoryResult = await CategoryModel.update(rawSequelizeCategory, {
                // To make sure your hooks always run, make sure to include this in
                // the query
                individualHooks: true,
                hooks: true,
                where: { category_id: category.CategoryId.getStringValue() }
            });

            return category;
        }
    }
}