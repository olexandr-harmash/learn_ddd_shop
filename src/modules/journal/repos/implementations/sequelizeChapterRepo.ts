// Import required modules and classes
import { Sequelize } from "sequelize";
import { Chapter } from "../../domain/Chapter";
import { IChapterRepo } from "../ChapterRepo";
import { ChapterMap } from "../../mappers/ChapterMap";
import { ISheetRepo } from "../SheetRepo";
import { Sheet } from "../../domain/Sheet";
import models from "../../../../shared/infra/database/sequelize/models";

/**
 * Chapter Repository Implementation (ChapterRepoImpl)
 * A class that provides methods to interact with the database for chapter-related operations.
 * Implements the IChapterRepo interface.
 */
export class ChapterRepoImpl implements IChapterRepo {
    private _models: typeof models;
    private _connection: Sequelize;
    private _sheetRepo: ISheetRepo;

    /**
     * ChapterRepoImpl constructor.
     * @param mod - An instance of Sequelize models.
     * @param conn - The Sequelize database connection.
     * @param sheetRepo - An instance of the Sheet Repository.
     */
    constructor(mod: typeof models, conn: Sequelize, sheetRepo: ISheetRepo) {
        this._models = mod;
        this._connection = conn;
        this._sheetRepo = sheetRepo;
    }

    /**
     * Sets the sheets for a given sequelizeChapterModel.
     * @param sequelizeChapterModel - The Sequelize chapter model instance.
     * @param sheets - An array of Sheet objects to be associated with the chapter.
     * @returns A promise that resolves to an array containing the result of setting the sheets.
     */
    private async setChapterSheets(sequelizeChapterModel: any, sheets: Sheet[]): Promise<any[]> {
        if (!sequelizeChapterModel || sheets.length === 0) return [];
        return sequelizeChapterModel.setSheets(sheets.map((s) => s.id.toString()));
    }

    /**
     * Saves a collection of chapters to the database.
     * @param chapters - An array of Chapter objects to be saved.
     * @returns A promise that resolves to the saved array of Chapter objects.
     */
    async saveCollection(chapters: Chapter[]): Promise<Chapter[]> {
        const ChapterModel = this._models.Chapter;
        const SheetRepo = this._sheetRepo;

        try {
            for (const ch of chapters) {
                const sheetResult = await SheetRepo.saveCollection(ch.sheets);

                const chapterResult = await ChapterModel.create(ChapterMap.toPersistence(ch));

                await this.setChapterSheets(chapterResult, sheetResult);
            }
        } catch (err) {
            throw err;
        }

        return chapters;
    }

    /**
     * Checks if a chapter with the given chapterId exists in the database.
     * @param chapterId - The ID of the chapter to check for existence.
     * @returns A promise that resolves to a boolean value indicating whether the chapter exists or not.
     */
    async exists(chapterId: number): Promise<boolean> {
        const chapter = await this._models.Chapter.findOne({
            where: {
                id: chapterId,
            },
        });

        const isChapterExist = !!chapter;

        return isChapterExist;
    }
}
