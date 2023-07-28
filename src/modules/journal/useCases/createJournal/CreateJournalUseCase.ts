// Import required modules and classes
import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Journal } from "../../domain/Journal";
import { Sheet } from "../../domain/Sheet";
import { IJournalRepo } from "../../repos/JournalRepo";
import { CreateJournalErrors } from "./CreateJournalErrors";
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
    private async getSheet(request: CreateSheetDTO[]): Promise<Result<Sheet>[]> {
        return Promise.all(request.map(({pageNumber, fileName}) => {
            return Sheet.create({ 
                fileName, 
                pageNumber,
             });
        }))
    }

    /**
     * Asynchronously executes the create journal use case based on the provided CreateJournalDTO.
     * @param journalDTO - The CreateJournalDTO containing the data for creating the journal.
     * @returns A promise that resolves to a CreateJournalResponse representing the result of the use case execution.
     */
    public async execute(journalDTO: CreateJournalDTO): Promise<CreateJournalResponse> {
        const { title, author, coverTitle, sheets } = journalDTO;

        try {
            const sheetsOrError = await this.getSheet(sheets);

            const isFailure = sheetsOrError.every(v => v.isFailure);

            if (isFailure) {
                return left(new CreateJournalErrors.CreateEntityError('initial sheets'));
            }

            const sheetsResult = sheetsOrError.map(v => v.getValue()) as Sheet[];

            const journalOrError = Journal.create({
                title: title,
                author: author,
                coverTitle: coverTitle,
                sheets: sheetsResult,
            });

            if (journalOrError.isFailure) {
                return left(new CreateJournalErrors.CreateEntityError('initial journal'));
            }

            const journal = journalOrError.getValue() as Journal;

            await this._journalRepo.save(journal);

            return right(Result.ok<void>());
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
