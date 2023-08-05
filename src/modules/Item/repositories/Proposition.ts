import { ItemId } from "../domain/ItemId"
import { Proposition } from "../domain/Proposition"
import { PropositionId } from "../domain/PropositionId"
import { PropositionList } from "../domain/PropositionList"

export interface IPropositionRepository {
    save(item: Proposition): Promise<Proposition>
    saveList(propositionList: PropositionList): Promise<PropositionList>
    exists(id: PropositionId): Promise<boolean>
    getItemById(id: PropositionId): Promise<Proposition>
    getItem(id: PropositionId): Promise<Proposition>
    getItemDetail(id: PropositionId): Promise<Proposition>
    getItemsDetailList(filter: any): Promise<Proposition>
}