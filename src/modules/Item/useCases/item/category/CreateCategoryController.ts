// Import required modules and classes
import * as express from 'express';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';
import { CreateCategoryErrors } from './CreateCategoryErrors';
import { CreateCategoryDTO } from './CreateCategoryDTO';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';

/**
 * Create Category Controller
 * A class that handles incoming HTTP requests for creating a new journal.
 * Extends the BaseController class.
 */
export class CreateCategoryController extends BaseController {
    private useCase: CreateCategoryUseCase;

    /**
     * CreateCategoryController constructor.
     * @param useCase - An instance of the CreateCategory use case.
     */
    constructor(useCase: CreateCategoryUseCase) {
        super();
        this.useCase = useCase;
    }

    private isValidCreateCategoryDTO(dto: CreateCategoryDTO): boolean {
        return (
            typeof dto.category === 'string'
        );
    }

    /**
     * Executes the create journal use case based on the incoming HTTP request.
     * @param req - The express Request object containing the HTTP request data.
     * @param res - The express Response object to send the HTTP response.
     * @returns A promise that resolves to the HTTP response.
     */
    async executeImpl(req: express.Request, res: express.Response): Promise<any> {
        const dto = req.body as CreateCategoryDTO; // Assuming CreateCategoryDTO is defined somewhere in the code

        // Validate the input DTO before executing the use case
        if (!this.isValidCreateCategoryDTO(dto)) {
            return this.clientError(res, "Invalid input parameters");
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case CreateCategoryErrors.CategoryAlreadyExistError:
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