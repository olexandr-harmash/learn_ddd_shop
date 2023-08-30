import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/infra/Mapper";
import { CategoryId } from "../domain/CategoryId";
import { Color } from "../domain/Color";
import { ColorList } from "../domain/ColorList";
import { Fabric } from "../domain/Fabric";
import { ImagePathList } from "../domain/ImagePathList";
import { Item } from "../domain/Item";
import { ItemDescription } from "../domain/ItemDescription";
import { Size } from "../domain/Size";
import { SizeList } from "../domain/SizeList";
import { ItemCardDTO } from "../dtos/ItemCard";
import { ItemCard2DTO } from "../dtos/ItemCard2";
import { ItemDetailDTO } from "../dtos/ItemDetail";
import { ColorMap } from "./ColorMap";
import { SizeMap } from "./SizeMap";


export class ItemMap implements Mapper<Item> {
    public static toPersistence(item: Item): any {
        return {
            category_id: item.categoryId.getStringValue(),
            item_id: item.itemId.getStringValue(),
            description: item.description.value,
            title: item.title,
            price: item.price,
            sale: item.sale,
            titleImagePath: item.titleImagePath,
        }
    }

    public static toDomain(raw: any): Item | null {
        const itemOrError = Item.create({
            categoryId: CategoryId.create(new UniqueEntityID(raw.category_id)).getValue() as CategoryId,
            fabric: Fabric.create({ cotton: raw.Fabric.cotton, poliester: raw.Fabric.poliester }).getValue() as Fabric,
            title: raw.title,
            price: raw.price,
            sale: raw.sale,
            titleImagePath: raw.titleImagePath,
            sizeList: raw.Sizes ? SizeList.create(raw.Sizes.map((c: any) => SizeMap.toDomain(c) as Size)) : undefined,
            colorList: raw.Colors ? ColorList.create(raw.Colors.map((c: any) => ColorMap.toDomain(c) as Color)) : undefined,
            description: ItemDescription.create({ value: raw.description }).getValue() as ItemDescription,
            imagePathList: ImagePathList.create(raw.ItemImages)
        }, new UniqueEntityID(raw.item_id));

        itemOrError.isFailure ? console.log(itemOrError.getErrorValue()) : '';

        return itemOrError.isSuccess ? itemOrError.getValue() as Item : null;
    }

    public static toDTO(item: Item) {
        return {
            ...ItemMap.toPersistence(item),
            colors: item.colorList.getItems().map(c => ColorMap.toPersistence(c)),
            sizes: item.sizeList.getItems().map(s => SizeMap.toPersistence(s)),
        }
    }

    public static toCardDTO(item: Item): ItemCardDTO {
        return {
            title: item.title,
            price: item.price,
            sale: item.sale,
            titleImagePath: item.titleImagePath,
        }
    }

    public static toDetailDTO(item: Item): ItemDetailDTO {
        return {
            title: item.title,
            price: item.price,
            sale: item.sale,
            description: item.description.value,
            imagePathList: item.imagePathList.getItems().map(p => p.path),
            fabric: {
                cotton: item.fabric.cotton,
                poliester: item.fabric.poliester,
            },
            colors: item.colorList.getItems().map(v => v.ColorId.getStringValue()),
            sizes: item.sizeList.getItems().map(v => v.SizeId.getStringValue()),
        }
    }

    public static toCard2DTO(item: Item): ItemCard2DTO {
        return {
            img: item.titleImagePath.replace('./static', 'http://localhost:8081'),
            sale: item.sale,
            prevValue: item.sale ? item.price : undefined,
            currValue: item.sale ? item.price / item.sale : item.price,
            name: item.title,
        }
    }
}