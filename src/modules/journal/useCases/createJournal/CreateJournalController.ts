// Import required modules and classes
import * as express from 'express';
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { CreateJournal } from './CreateJournalUseCase';
import { CreateJournalErrors } from './CreateJournalErrors';

/**
 * Create Journal Controller
 * A class that handles incoming HTTP requests for creating a new journal.
 * Extends the BaseController class.
 */
export class CreateJournalController extends BaseController {
    private useCase: CreateJournal;

    /**
     * CreateJournalController constructor.
     * @param useCase - An instance of the CreateJournal use case.
     */
    constructor(useCase: CreateJournal) {
        super();
        this.useCase = useCase;
    }

    /**
     * Validates the CreateSheetDTO object.
     * @param dto - The CreateSheetDTO object to validate.
     * @returns True if the DTO is valid; otherwise, false.
     */
    private isValidCreateSheetDTO(dto: CreateSheetDTO): boolean {
        return typeof dto.fileName === 'string' && typeof dto.pageNumber === 'number' && dto.pageNumber >= 0;
    }

    /**
     * Validates the CreateChapterDTO object.
     * @param dto - The CreateChapterDTO object to validate.
     * @returns True if the DTO is valid; otherwise, false.
     */
    private isValidCreateChapterDTO(dto: CreateChapterDTO): boolean {
        return (
            typeof dto.title === 'string' &&
            typeof dto.pageCount === 'number' && dto.pageCount >= 0 &&
            typeof dto.chapterNumber === 'number' && dto.chapterNumber >= 0 &&
            Array.isArray(dto.sheets) && dto.sheets.every((sheet) => this.isValidCreateSheetDTO(sheet))
        );
    }

    /**
     * Validates the CreateVolumeDTO object.
     * @param dto - The CreateVolumeDTO object to validate.
     * @returns True if the DTO is valid; otherwise, false.
     */
    private isValidCreateVolumeDTO(dto: CreateVolumeDTO): boolean {
        return (
            typeof dto.title === 'string' &&
            typeof dto.number === 'number' && dto.number >= 0 &&
            Array.isArray(dto.chapters) && dto.chapters.every((chapter) => this.isValidCreateChapterDTO(chapter))
        );
    }

    /**
     * Validates the CreateJournalDTO object.
     * @param dto - The CreateJournalDTO object to validate.
     * @returns True if the DTO is valid; otherwise, false.
     */
    private isValidCreateJournalDTO(dto: CreateJournalDTO): boolean {
        return (
            typeof dto.title === 'string' &&
            typeof dto.author === 'string' &&
            typeof dto.coverTitle === 'string' &&
            Array.isArray(dto.volumes) && dto.volumes.every((volume) => this.isValidCreateVolumeDTO(volume))
        );
    }

    /**
     * Executes the create journal use case based on the incoming HTTP request.
     * @param req - The express Request object containing the HTTP request data.
     * @param res - The express Response object to send the HTTP response.
     * @returns A promise that resolves to the HTTP response.
     */
    async executeImpl(req: express.Request, res: express.Response): Promise<any> {
        const dto = req.body as CreateJournalDTO; // Assuming CreateJournalDTO is defined somewhere in the code

        // Validate the input DTO before executing the use case
        if (!this.isValidCreateJournalDTO(dto)) {
            return this.clientError(res, "Invalid input parameters");
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case CreateJournalErrors.JournalAlreadyExistsError:
                        return this.conflict(res, error.getErrorValue().message);
                    default:
                        return this.fail(res, error.getErrorValue().message);
                }
            } else {
                return this.ok(res);
            }
        } catch (err: any) {
            return this.fail(res, err);
        }
    }
}
