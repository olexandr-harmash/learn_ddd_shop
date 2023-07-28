import { Sheet } from "../domain/Sheet";


export interface ISheetRepo {
    exists(sheetId: number): Promise<boolean>;
    saveCollection(sheet: Sheet[], journalId: string): Promise<Sheet[]>;
}