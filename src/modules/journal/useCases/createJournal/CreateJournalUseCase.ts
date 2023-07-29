// Import required modules and classes
import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Journal } from "../../domain/Journal";
import { File as FileValueObj } from "../../domain/File"; // Importing the FileValueObj (assuming it represents the file data in the domain)
import { Sheet } from "../../domain/Sheet";
import { Sheets } from "../../domain/Sheets"; // Importing Sheets (assuming it represents a collection of Sheet objects)
import { IJournalRepo } from "../../repos/JournalRepo";
import { CreateJournalErrors } from "./CreateJournalErrors";
import { CreateJournalResponse } from "./CreateJournalResponse";
import path from 'path';

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
     * Asynchronously creates a new sheet based on the provided CreateSheetDTO.
     * @param sheetDTO - The CreateSheetDTO containing the data for creating the sheet.
     * @returns A promise that resolves to a Result with either a created Sheet object or an error.
     */
    private async getSheet(sheetDTO: CreateSheetDTO[]): Promise<Result<Sheet>[]> {
        return Promise.all(sheetDTO.map(async ({ pageNumber, byteArray }) => {
            // Creating a FileValueObj with the provided byteArray and saving it
            const img = FileValueObj.create(path.resolve('./', 'static'), byteArray)

            if (img.isFailure) {
                return Result.fail<Sheet>('');
            } else {
                await img.getValue()?.save()
            }

            // Creating the Sheet object with the image and pageNumber
            return Sheet.create({ 
                image: img.getValue() as FileValueObj, 
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
        const { byteArray, author, coverTitle, sheets } = journalDTO;

        try {
            // Creating sheets based on the provided sheet data
            const sheetsOrError = await this.getSheet(sheets);

            const isFailure = sheetsOrError.every(v => v.isFailure);

            if (isFailure) {
                return left(new CreateJournalErrors.CreateEntityError('initial sheets'));
            }

            const sheetsResult = sheetsOrError.map(v => v.getValue()) as Sheet[];

            /**
             * TODO: save files via file service (assuming it's not implemented yet)
             * Creating a FileValueObj with the provided byteArray and saving it
             */
            const img = await FileValueObj.create(path.resolve('./', 'static'), byteArray)
            
            if (img.isFailure) {
                return left(new CreateJournalErrors.CreateEntityError('initial journal file'));
            } else {
                await img.getValue()?.save()
            }

            // Creating the Journal object with the image, author, coverTitle, and sheets
            const journalOrError = Journal.create({
                image: img.getValue() as FileValueObj,
                author: author,
                coverTitle: coverTitle,
                sheets: Sheets.create(sheetsResult), // Assuming Sheets is a factory method to create the collection of sheets
            });

            if (journalOrError.isFailure) {
                return left(new CreateJournalErrors.CreateEntityError('initial journal'));
            }

            const journal = journalOrError.getValue() as Journal;

            // Saving the created journal to the repository
            await this._journalRepo.save(journal);

            return right(Result.ok<void>());
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
