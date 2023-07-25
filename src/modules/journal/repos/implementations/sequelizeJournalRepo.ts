// Import required modules and classes
import { Sequelize } from "sequelize";
import models from "../../../../shared/infra/database/sequelize/models";
import { Journal } from "../../domain/Journal";
import { JournalMap } from "../../mappers/JournalMap";
import { IJournalRepo } from "../JournalRepo";
import { IVolumeRepo } from "../VolumeRepo";
import { Volume } from "../../domain/Volume";

/**
 * Journal Repository Implementation (JournalRepoImpl)
 * A class that provides methods to interact with the database for journal-related operations.
 * Implements the IJournalRepo interface.
 */
export class JournalRepoImpl implements IJournalRepo {
    private _models: typeof models;
    private _connection: Sequelize;
    private _volumesRepo: IVolumeRepo;

    /**
     * JournalRepoImpl constructor.
     * @param mod - An instance of Sequelize models.
     * @param conn - The Sequelize database connection.
     * @param volumeRepo - An instance of the Volume Repository.
     */
    constructor(mod: typeof models, conn: Sequelize, volumeRepo: IVolumeRepo) {
        this._models = mod;
        this._connection = conn;
        this._volumesRepo = volumeRepo;
    }

    /**
     * Sets the volumes for a given sequelizeJournalModel.
     * @param sequelizeJournalModel - The Sequelize journal model instance.
     * @param volumes - An array of Volume objects to be associated with the journal.
     * @returns A promise that resolves to an array containing the result of setting the volumes.
     */
    private async setJournalVolumes(sequelizeJournalModel: any, volumes: Volume[]): Promise<any[]> {
        if (!sequelizeJournalModel || volumes.length === 0) return [];

        return sequelizeJournalModel.setVolumes(volumes.map((v) => v.id.toString()));
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
        const rawJournal: any = JournalMap.toPersistence(journal);

        try {
            const volumeResult = await this._volumesRepo.saveCollection(journal.volumes);

            const journalResult = await JournalModel.create(rawJournal);

            await this.setJournalVolumes(journalResult, volumeResult);
        } catch (err) {
            throw err;
        }

        return journal;
    }
}
