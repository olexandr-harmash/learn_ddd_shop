import { ImagePath } from "./ImagePath";
import { WatchedList } from "../../../shared/domain/WatchedList";

export class ImagePathList extends WatchedList<ImagePath> {
    compareItems(a: ImagePath, b: ImagePath): boolean {
        return a.equals(b)
    }

    private constructor(initialImagePaths: ImagePath[]) {
        super(initialImagePaths)
    }

    public static create(initialImagePaths?: ImagePath[]): ImagePathList {
        return new ImagePathList(initialImagePaths ? initialImagePaths : []);
    }
}