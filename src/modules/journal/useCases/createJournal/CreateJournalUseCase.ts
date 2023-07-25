// Import required modules and classes
import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Chapter } from "../../domain/Chapter";
import { Journal } from "../../domain/Journal";
import { Sheet } from "../../domain/Sheet";
import { Volume } from "../../domain/Volume";
import { IJournalRepo } from "../../repos/JournalRepo";
import { CreateJournalResponse } from "./CreateJournalResponse";

/**
 * Create Journal Use Case (CreateJournal)
 * A class that represents the use case for creating a new journal and its associated volumes, chapters, and sheets.
 * Implements the UseCase interface.
 */
export class CreateJournal implements UseCase<any, Promise<CreateJournalResponse>> {
    private _journalRepo: IJournalRepo;

    /**
     * CreateJournal constructor.
     * @param journalRepo - An instance of the Journal Repository.
     */
    constructor(journalRepo: IJournalRepo) {
        this._journalRepo = journalRepo;
    }

    /**
     * Asynchronously creates a new chapter based on the provided CreateChapterDTO.
     * @param request - The CreateChapterDTO containing the data for creating the chapter.
     * @returns A promise that resolves to a Result with either a created Chapter object or an error.
     */
    private async getChapter(request: CreateChapterDTO): Promise<Result<Chapter>> {
        const { title, pageCount, chapterNumber, sheets: sheetsDTO } = request;
        const sheets: Sheet[] = [];

        for (const s of sheetsDTO) {
            const sheetOrError = await Sheet.create({ fileName: s.fileName, pageNumber: s.pageNumber });

            if (sheetOrError.isFailure) {
                return Result.fail<Chapter>('');
            } else {
                sheets.push(sheetOrError.getValue() as Sheet);
            }
        }

        return Chapter.create({
            title,
            pageCount,
            chapterNumber,
            sheets: sheets,
        });
    }

    /**
     * Asynchronously creates a new volume based on the provided CreateVolumeDTO.
     * @param request - The CreateVolumeDTO containing the data for creating the volume.
     * @returns A promise that resolves to a Result with either a created Volume object or an error.
     */
    private async getVolume(request: CreateVolumeDTO): Promise<Result<Volume>> {
        const { title, number, chapters: chaptersDTO } = request;
        const chapters: Chapter[] = [];

        for (const c of chaptersDTO) {
            const chapterOrError = await this.getChapter(c);

            if (chapterOrError.isFailure) {
                return Result.fail<Volume>('');
            } else {
                chapters.push(chapterOrError.getValue() as Chapter);
            }
        }

        return Volume.create({
            title,
            number,
            chapters: chapters,
        });
    }

    /**
     * Asynchronously executes the create journal use case based on the provided CreateJournalDTO.
     * @param journalDTO - The CreateJournalDTO containing the data for creating the journal.
     * @returns A promise that resolves to a CreateJournalResponse representing the result of the use case execution.
     */
    public async execute(journalDTO: CreateJournalDTO): Promise<CreateJournalResponse> {
        const { title, author, coverTitle, volumes: volumesDTO } = journalDTO;
        const volumes: Volume[] = [];

        try {
            for (const v of volumesDTO) {
                const volumeOrError = await this.getVolume(v);

                if (volumeOrError.isFailure) {
                    return left(Result.fail<Journal>('error volume'));
                } else {
                    volumes.push(volumeOrError.getValue() as Volume);
                }
            }

            const journalOrError = Journal.create({
                title: title,
                author: author,
                coverTitle: coverTitle,
                volumes: volumes,
            });

            if (journalOrError.isFailure) return left(Result.fail<Journal>('error journal create'));

            const journal = journalOrError.getValue();

            if (!!journal) await this._journalRepo.save(journal);

            return right(Result.ok<void>());
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
