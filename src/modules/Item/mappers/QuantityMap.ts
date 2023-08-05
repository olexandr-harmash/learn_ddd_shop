import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/infra/Mapper";
import { Quantity } from "../domain/Quantity";


export class QuantityMap implements Mapper<Quantity> {
    public static toPersistence(quantity: Quantity): any {
        return {
            quantity: quantity.quantity,
        }
    }

    public static toDomain(raw: any): Quantity | null {
        const itemOrError = Quantity.create({
            shopId: raw.shopId,
            quantity: raw.quantity,
            propositionId: raw.propositionId
        }, new UniqueEntityID(raw.quantity_id));

        itemOrError.isFailure ? console.log(itemOrError.getErrorValue()) : '';

        return itemOrError.isSuccess ? itemOrError.getValue() as Quantity : null;
    }
}