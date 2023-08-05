// Import required modules and classes
import * as express from 'express';
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { CreatePropositionUseCase } from './CreatePropositionUseCase';
import { CreatePropositionDTO, CreatePropositionListDTO } from './CreatePropositionDTO';
import { CreatePropositionErrors } from './CreatePropositionErrors';

/**
 * Create Proposition Controller
 * A class that handles incoming HTTP requests for creating a new journal.
 * Extends the BaseController class.
 */
export class CreatePropositionController extends BaseController {
    private useCase: CreatePropositionUseCase;

    /**
     * CreatePropositionController constructor.
     * @param useCase - An instance of the CreateProposition use case.
     */
    constructor(useCase: CreatePropositionUseCase) {
        super();
        this.useCase = useCase;
    }

    private isValidCreatePropositionDTO(dto: CreatePropositionListDTO): boolean {
        return (
            dto.propositionList.length !== 0
        );
    }

    /**
     * Executes the create journal use case based on the incoming HTTP request.
     * @param req - The express Request object containing the HTTP request data.
     * @param res - The express Response object to send the HTTP response.
     * @returns A promise that resolves to the HTTP response.
     */
    async executeImpl(req: express.Request, res: express.Response): Promise<any> {
        const dto = req.body as CreatePropositionListDTO; // Assuming CreatePropositionDTO is defined somewhere in the code
        
        // Validate the input DTO before executing the use case
        if (!this.isValidCreatePropositionDTO(dto)) {
            return this.clientError(res, "Invalid input parameters");
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case CreatePropositionErrors.PropositionAlreadyExistError:
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