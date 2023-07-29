import { Sheet } from "../domain/Sheet";


export interface ISheetRepo {
    exists(sheetId: string): Promise<boolean>;
    saveCollection(sheet: Sheet[], journalId: string): Promise<void>;
    save(journal: Sheet, journalId: string): Promise<void>;
}