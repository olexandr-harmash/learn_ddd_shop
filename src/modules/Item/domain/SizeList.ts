import { WatchedList } from "../../../shared/domain/WatchedList";
import { Size } from "./Size";

export class SizeList extends WatchedList<Size> {
    compareItems(a: Size, b: Size): boolean {
        return a.equals(b)
    }

    private constructor(initialSizes: Size[]) {
        super(initialSizes)
    }

    public static create(initialSizes?: Size[]): SizeList {
        return new SizeList(initialSizes ? initialSizes : []);
    }
}