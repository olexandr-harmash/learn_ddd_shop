// Import required modules and classes
import * as express from 'express';
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { CreateItemUseCase } from './CreateItemUseCase';
import { CreateItemErrors } from './CreateItemErrors';
import { CreateItemDTO } from './CreateItemDTO';

/**
 * Create Item Controller
 * A class that handles incoming HTTP requests for creating a new journal.
 * Extends the BaseController class.
 */
export class CreateItemController extends BaseController {
    private useCase: CreateItemUseCase;

    /**
     * CreateItemController constructor.
     * @param useCase - An instance of the CreateItem use case.
     */
    constructor(useCase: CreateItemUseCase) {
        super();
        this.useCase = useCase;
    }

    private isValidCreateItemDTO(dto: CreateItemDTO): boolean {
        return (
            typeof dto.description === 'string' && 
            typeof dto.title === 'string' &&
            dto.sale &&
            dto.price &&
            dto.files && 
            Object.keys(dto.files).length !== 0
        );
    }

    /**
     * Executes the create journal use case based on the incoming HTTP request.
     * @param req - The express Request object containing the HTTP request data.
     * @param res - The express Response object to send the HTTP response.
     * @returns A promise that resolves to the HTTP response.
     */
    async executeImpl(req: express.Request, res: express.Response): Promise<any> {
        const dto = req.body as CreateItemDTO; // Assuming CreateItemDTO is defined somewhere in the code
        dto.files = req.files;

        // Validate the input DTO before executing the use case
        if (!this.isValidCreateItemDTO(dto)) {
            return this.clientError(res, "Invalid input parameters");
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case CreateItemErrors.ItemAlreadyExistError:
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