import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/infra/Mapper";
import { ImagePath } from "../domain/ImagePath";


export class ImagePathMap implements Mapper<ImagePath> {
    public static toPersistence(imagePath: ImagePath): any {
        return {
            image_path_id: imagePath.imagePathId.getStringValue(),
            path: imagePath.path,
        }
    }

    public static toDomain(raw: any): ImagePath | null {
        const imagePathOrError = ImagePath.create({
            filePath: raw.path
        }, new UniqueEntityID(raw.image_path_id));

        imagePathOrError.isFailure ? console.log(imagePathOrError.getErrorValue()) : '';

        return imagePathOrError.isSuccess ? imagePathOrError.getValue() as ImagePath : null;
    }
}