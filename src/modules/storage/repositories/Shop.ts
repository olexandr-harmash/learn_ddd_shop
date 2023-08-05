import { Shop } from "../domain/Shop"
import { ShopId } from "../domain/ShopId"

export interface IShopRepository {
    save(Shop: Shop): Promise<Shop>
    exists(id: ShopId): Promise<boolean>
    getShopById(id: ShopId): Promise<Shop>
    getShop(id: ShopId): Promise<Shop>
    getShopDetail(id: ShopId): Promise<Shop>
    getShopsDetailList(filter: any): Promise<Shop>
}