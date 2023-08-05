import { Quantity } from "../domain/Quantity"
import { QuantityId } from "../domain/QuantityId"
import { QuantityList } from "../domain/QuantityList"

export interface IQuantityRepository {
    save(item: Quantity): Promise<Quantity>
    exists(id: QuantityId): Promise<boolean>
    saveList(item: QuantityList): Promise<QuantityList>
    getItemById(id: QuantityId): Promise<Quantity>
    getItem(id: QuantityId): Promise<Quantity>
    getItemDetail(id: QuantityId): Promise<Quantity>
    getItemsDetailList(filter: any): Promise<Quantity>
}