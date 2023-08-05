import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { ImagePathId } from "./ImagePathId";

interface ImagePathProps {
    filePath: string;
}

export class ImagePath extends Entity<ImagePathProps> {
    get imagePathId(): ImagePathId {
        return ImagePathId.create(this._id).getValue() as ImagePathId;
    }

    get path(): string {
        return this.props.filePath
    }

    private constructor(props: ImagePathProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: ImagePathProps, id?: UniqueEntityID): Result<ImagePath> {
        // Проверяем свойства images и description на null или undefined с помощью Guard
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: props?.filePath, argumentName: 'file_path' },
        ]);

        // Если проверка проходит успешно, создаем новый экземпляр Item
        if (!propsResult.isSuccess) {
            return Result.fail<ImagePath>(propsResult.getErrorValue());
        }

        return Result.ok<ImagePath>(new ImagePath({ ...props }, id));
    }
}