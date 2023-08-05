import { CategoryId } from "../domain/CategoryId"
import { ColorId } from "../domain/ColorId"
import { Item } from "../domain/Item"
import { ItemId } from "../domain/ItemId"
import { ItemList } from "../domain/ItemList"
import { SizeId } from "../domain/SizeId"

export interface GetItemCardListFilters {
    limit?: number;
    offset?: number;

    categoryIds: CategoryId[];

    price: {
        from: number;
        to: number;
    }

    sizeIds?: SizeId[];
    colorIds?: ColorId[];
}

export interface IItemRepository {
    save(item: Item): Promise<Item>
    exists(id: ItemId): Promise<boolean>
    getItemById(id: ItemId): Promise<Item>
    getItem(id: ItemId): Promise<Item>
    getItemDetail(id: ItemId): Promise<Item>
    getItemDetailList(filter: GetItemCardListFilters): Promise<ItemList>
    getItemCardList(filter: GetItemCardListFilters): Promise<ItemList>
}