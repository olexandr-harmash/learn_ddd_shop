import { WatchedList } from "../../../shared/domain/WatchedList";
import { Color } from "./Color";

export class ColorList extends WatchedList<Color> {
    compareItems(a: Color, b: Color): boolean {
        return a.equals(b)
    }

    private constructor(initialColors: Color[]) {
        super(initialColors)
    }

    public static create(initialColors?: Color[]): ColorList {
        return new ColorList(initialColors ? initialColors : []);
    }
}