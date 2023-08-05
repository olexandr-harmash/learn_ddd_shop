import { WatchedList } from "../../../shared/domain/WatchedList";
import { Item } from "./Item";

export class ItemList extends WatchedList<Item> {
    compareItems(a: Item, b: Item): boolean {
        return a.equals(b)
    }

    private constructor(initialQuantities: Item[]) {
        super(initialQuantities)
    }

    public static create(initialQuantities?: Item[]): ItemList {
        return new ItemList(initialQuantities ? initialQuantities : []);
    }
}