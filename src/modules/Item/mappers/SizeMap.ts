import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/infra/Mapper";
import { Size } from "../domain/Size";


export class SizeMap implements Mapper<Size> {
    public static toPersistence(size: Size): any {
        return {
            size_id: size.SizeId.getStringValue(),
            size: size.value,
        }
    }

    public static toDomain(raw: any): Size | null {
        const sizeOrError = Size.create({
            value: raw.size,
        }, new UniqueEntityID(raw.size_id));
        
        sizeOrError.isFailure ? console.log(sizeOrError.getErrorValue()) : '';

        return sizeOrError.isSuccess ? sizeOrError.getValue() as Size : null;
    }
}