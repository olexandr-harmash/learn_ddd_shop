import { ImagePath } from "../domain/ImagePath"
import { ImagePathId } from "../domain/ImagePathId"
import { ImagePathList } from "../domain/ImagePathList"
import { ItemId } from "../domain/ItemId"

export interface IImagePathRepository {
    save(imagePath: ImagePath, itemId: ItemId): Promise<ImagePath>
    saveList(imagePath: ImagePathList, itemId: ItemId): Promise<ImagePathList>
    exists(id: ImagePathId): Promise<boolean>
    getItemById(id: ImagePathId): Promise<ImagePath>
    getItem(id: ImagePathId): Promise<ImagePath>
    getItemDetail(id: ImagePathId): Promise<ImagePath>
    getItemsDetailList(filter: any): Promise<ImagePath>
}