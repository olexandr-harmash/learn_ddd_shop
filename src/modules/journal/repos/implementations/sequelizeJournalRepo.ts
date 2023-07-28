// Import required modules and classes
import models from "../../../../shared/infra/database/sequelize/models";
import { Journal } from "../../domain/Journal";
import { JournalMap } from "../../mappers/JournalMap";
import { IJournalRepo } from "../JournalRepo";
import { ISheetRepo } from "../SheetRepo";
/**
 * Journal Repository Implementation (JournalRepoImpl)
 * A class that provides methods to interact with the database for journal-related operations.
 * Implements the IJournalRepo interface.
 */
export class JournalRepoImpl implements IJournalRepo {
    private _models: typeof models;
    private _sheetRepo: ISheetRepo;

    /**
     * JournalRepoImpl constructor.
     * @param mod - An instance of Sequelize models.
     * @param conn - The Sequelize database connection.
     * @param volumeRepo - An instance of the Volume Repository.
     */
    constructor(mod: typeof models, sheetRepo: ISheetRepo) {
        this._models = mod;
        this._sheetRepo = sheetRepo;
    }

    /**
     * Checks if a journal with the given journalId exists in the database.
     * @param journalId - The ID of the journal to check for existence.
     * @returns A promise that resolves to a boolean value indicating whether the journal exists or not.
     */
    async exists(journalId: number): Promise<boolean> {
        const journal = await this._models.Journal.findOne({
            where: {
                id: journalId,
            },
        });

        const isJournalExist = !!journal;

        return isJournalExist;
    }

    /**
     * Saves a journal to the database along with its associated volumes.
     * @param journal - The Journal object to be saved.
     * @returns A promise that resolves to the saved Journal object.
     */
    async save(journal: Journal): Promise<Journal> {
        const JournalModel = this._models.Journal;

        try {
            const rawJournal = JournalMap.toPersistence(journal);

            const journalResult = await JournalModel.create(rawJournal);

            if (!journalResult) {
                throw new Error('Something with creating journal models')
            }

            const sheetResult = await this._sheetRepo.saveCollection(journal.sheets, journalResult.id);
        } catch (err: any) {
            JournalModel.destroy()
            throw new Error(err.toString());
        }

        const journalResult = JournalMap.toDomain(journal);

        if (!journalResult) {
            throw new Error('Something with creating journal domain')
        }

        return journalResult as Journal;
    }
}
