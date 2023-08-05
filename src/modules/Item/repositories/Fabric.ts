import { Fabric } from "../domain/Fabric"
import { FabricId } from "../domain/FabricId"
import { ItemId } from "../domain/ItemId"

export interface IFabricRepository {
    save(item: Fabric, itemId: ItemId): Promise<Fabric>
    exists(id: FabricId): Promise<boolean>
    getItemById(id: FabricId): Promise<Fabric>
    getItem(id: FabricId): Promise<Fabric>
}