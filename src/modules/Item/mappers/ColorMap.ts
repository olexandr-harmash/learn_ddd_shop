import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/infra/Mapper";
import { Color } from "../domain/Color";


export class ColorMap implements Mapper<Color> {
    public static toPersistence(color: Color): any {
        return {
            color_id: color.ColorId.getStringValue(),
            color: color.value,
        }
    }

    public static toDomain(raw: any): Color | null {
        const colorOrError = Color.create({
            value: raw.color,
        }, new UniqueEntityID(raw.color_id));
        
        colorOrError.isFailure ? console.log(colorOrError.getErrorValue()) : '';

        return colorOrError.isSuccess ? colorOrError.getValue() as Color : null;
    }
}