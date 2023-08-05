import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/infra/Mapper";
import { ColorId } from "../domain/ColorId";
import { ImagePathList } from "../domain/ImagePathList";
import { ItemId } from "../domain/ItemId";
import { Proposition } from "../domain/Proposition";
import { SizeId } from "../domain/SizeId";


export class PropositionMap implements Mapper<Proposition> {
    public static toPersistence(proposition: Proposition): any {
        return {
            proposition_id: proposition.propositionId.getStringValue(),
            item_id: proposition.itemId.getStringValue(),
            size_id: proposition.sizeId.getStringValue(),
            color_id: proposition.colorId.getStringValue()
        }
    }

    public static toDomain(raw: any): Proposition | null {
        const itemOrError = Proposition.create({
            itemId: ItemId.create(raw.item_id).getValue() as ItemId,
            sizeId: SizeId.create(raw.size_id).getValue() as SizeId,
            colorId: ColorId.create(raw.color_id).getValue() as ColorId,
        }, new UniqueEntityID(raw.proposition_id));

        itemOrError.isFailure ? console.log(itemOrError.getErrorValue()) : '';

        return itemOrError.isSuccess ? itemOrError.getValue() as Proposition : null;
    }
}