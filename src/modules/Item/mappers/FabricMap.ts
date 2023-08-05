import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/infra/Mapper";
import { Fabric } from "../domain/Fabric";


export class FabricMap implements Mapper<Fabric> {
    public static toPersistence(fabric: Fabric): any {
        return {
            fabric_id: fabric.FabricId.getStringValue(),
            cotton: fabric.cotton,
            poliester: fabric.poliester,
        }
    }

    public static toDomain(raw: any): Fabric | null {
        const itemOrError = Fabric.create({
            cotton: raw.cotton,
            poliester: raw.poliester,
        }, new UniqueEntityID(raw.fabric_id));

        itemOrError.isFailure ? console.log(itemOrError.getErrorValue()) : '';

        return itemOrError.isSuccess ? itemOrError.getValue() as Fabric : null;
    }
}