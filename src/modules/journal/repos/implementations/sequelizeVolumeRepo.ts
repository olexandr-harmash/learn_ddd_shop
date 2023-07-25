// Import required modules and classes
import { Op, Sequelize } from "sequelize";
import models from "../../../../shared/infra/database/sequelize/models";
import { Volume } from "../../domain/Volume";
import { VolumeMap } from "../../mappers/VolumeMap";
import { IVolumeRepo } from "../VolumeRepo";
import { IChapterRepo } from "../ChapterRepo";
import { Chapter } from "../../domain/Chapter";

/**
 * Volume Repository Implementation (VolumeRepoImpl)
 * A class that provides methods to interact with the database for volume-related operations.
 * Implements the IVolumeRepo interface.
 */
export class VolumeRepoImpl implements IVolumeRepo {
    private _models: typeof models;
    private _connection: Sequelize;
    private _chapterRepo: IChapterRepo;

    /**
     * VolumeRepoImpl constructor.
     * @param mod - An instance of Sequelize models.
     * @param conn - The Sequelize database connection.
     * @param chapterRepo - An instance of the Chapter Repository.
     */
    constructor(mod: typeof models, conn: Sequelize, chapterRepo: IChapterRepo) {
        this._models = mod;
        this._connection = conn;
        this._chapterRepo = chapterRepo;
    }

    /**
     * Sets the chapters for a given sequelizeVolumeModel.
     * @param sequelizeVolumeModel - The Sequelize volume model instance.
     * @param chapters - An array of Chapter objects to be associated with the volume.
     * @returns A promise that resolves to an array containing the result of setting the chapters.
     */
    private async setVolumeChapters(sequelizeVolumeModel: any, chapters: Chapter[]): Promise<any[]> {
        if (!sequelizeVolumeModel || chapters.length === 0) return [];
        return sequelizeVolumeModel.setChapters(chapters.map((c) => c.id.toString()));
    }

    /**
     * Saves a collection of volumes and their associated chapters to the database.
     * @param volumes - An array of Volume objects to be saved.
     * @returns A promise that resolves to an array of saved Volume objects.
     */
    async saveCollection(volumes: Volume[]): Promise<Volume[]> {
        const VolumeModel = this._models.Volume;
        const ChapterRepo = this._chapterRepo;

        try {
            for (const volume of volumes) {
                const chapterResult = await ChapterRepo.saveCollection(volume.chapters);

                const volumeResult = await VolumeModel.create(VolumeMap.toPersistence(volume));

                await this.setVolumeChapters(volumeResult, chapterResult);
            }
        } catch (err) {
            throw err;
        }

        return volumes;
    }

    /**
     * Checks if a volume with the given volumeId exists in the database.
     * @param volumeId - The ID of the volume to check for existence.
     * @returns A promise that resolves to a boolean value indicating whether the volume exists or not.
     */
    async exists(volumeId: number): Promise<boolean> {
        const volume = await this._models.Volume.findOne({
            where: {
                id: volumeId,
            },
        });

        const isVolumeExist = !!volume;

        return isVolumeExist;
    }
}
