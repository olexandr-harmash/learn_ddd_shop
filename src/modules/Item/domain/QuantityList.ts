import { WatchedList } from "../../../shared/domain/WatchedList";
import { Quantity } from "./Quantity";

export class QuantityList extends WatchedList<Quantity> {
    compareItems(a: Quantity, b: Quantity): boolean {
        return a.equals(b)
    }

    private constructor(initialQuantities: Quantity[]) {
        super(initialQuantities)
    }

    public static create(initialQuantities?: Quantity[]): QuantityList {
        return new QuantityList(initialQuantities ? initialQuantities : []);
    }
}