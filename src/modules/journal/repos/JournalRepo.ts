import { Journal } from "../domain/Journal";


export interface IJournalRepo {
    exists(journalId: number): Promise<boolean>;
    save(journal: Journal): Promise<Journal>;
}