import { WatchedList } from "../../../shared/domain/WatchedList";
import { Proposition } from "./Proposition";

export class PropositionList extends WatchedList<Proposition> {
    compareItems(a: Proposition, b: Proposition): boolean {
        return a.equals(b)
    }

    private constructor(initialPropositions: Proposition[]) {
        super(initialPropositions)
    }

    public static create(initialPropositions?: Proposition[]): PropositionList {
        return new PropositionList(initialPropositions ? initialPropositions : []);
    }
}