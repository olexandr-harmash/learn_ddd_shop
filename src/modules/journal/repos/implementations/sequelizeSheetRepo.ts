// Import required modules and classes
import models from "../../../../shared/infra/database/sequelize/models";
import { Sheet } from "../../domain/Sheet";
import { ISheetRepo } from "../SheetRepo";
import { SheetMap } from "../../mappers/SheetMap";

/**
 * Sheet Repository Implementation (SheetRepoImpl)
 * A class that provides methods to interact with the database for sheet-related operations.
 * Implements the ISheetRepo interface.
 */
export class SheetRepoImpl implements ISheetRepo {
    private _models: typeof models;

    /**
     * SheetRepoImpl constructor.
     * @param mod - An instance of Sequelize models.
     * @param conn - The Sequelize database connection.
     */
    constructor(mod: typeof models) {
        this._models = mod;
    }

    /**
     * Saves a collection of sheets to the database.
     * @param sheets - An array of Sheet objects to be saved.
     * @returns A promise that resolves to the saved array of Sheet objects.
     */
    async saveCollection(sheets: Sheet[], journalId: string): Promise<Sheet[]> {
        const SheetModel = this._models.Sheet;

        const sheetsResult = await SheetModel.bulkCreate(
            sheets.map(SheetMap.toPersistence),
            { ignoreDuplicates: false }
        );
        
        if (!sheetsResult) {
            throw new Error('Something with creating sheet models')
        }

        const result = sheetsResult.map((v) => {
            v.setJournal(journalId)
            
            return SheetMap.toDomain(v)
        })
        
        const isFailure = result.every(v=>!v)

        if (isFailure) {
            throw new Error('Something with creating sheet models')
        }

        return result as Sheet[]
    }

    /**
     * Checks if a sheet with the given sheetId exists in the database.
     * @param sheetId - The ID of the sheet to check for existence.
     * @returns A promise that resolves to a boolean value indicating whether the sheet exists or not.
     */
    async exists(sheetId: number): Promise<boolean> {
        const sheet = await this._models.Sheet.findOne({
            where: {
                id: sheetId,
            },
        });

        const isSheetExist = !!sheet;

        return isSheetExist;
    }
}
