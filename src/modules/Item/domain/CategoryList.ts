import { WatchedList } from "../../../shared/domain/WatchedList";
import { Category } from "./Category";

export class CategoryList extends WatchedList<Category> {
    compareItems(a: Category, b: Category): boolean {
        return a.equals(b)
    }

    private constructor(initialCategorys: Category[]) {
        super(initialCategorys)
    }

    public static create(initialCategorys?: Category[]): CategoryList {
        return new CategoryList(initialCategorys ? initialCategorys : []);
    }
}