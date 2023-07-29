import { Journal } from "../domain/Journal";


export interface IJournalRepo {
    exists(journalId: string): Promise<boolean>;
    save(journal: Journal): Promise<void>;
}