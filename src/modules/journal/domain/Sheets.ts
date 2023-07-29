import { WatchedList } from "../../../shared/domain/WatchedList";

import { Sheet } from "./Sheet";

export class Sheets extends WatchedList<Sheet> {
  compareItems(a: Sheet, b: Sheet): boolean {
      return a.id.toString() === b.id.toString()
  }

  private constructor (initialVotes: Sheet[]) {
    super(initialVotes)
  }

  public static create (sheets?: Sheet[]): Sheets {
    return new Sheets(sheets ? sheets : []);
  }
}