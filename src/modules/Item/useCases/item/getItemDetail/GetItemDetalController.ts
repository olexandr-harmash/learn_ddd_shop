// Import required modules and classes
import * as express from 'express';
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { GetItemDetailUseCase } from './GetItemDetalUseCase';
import { GetItemDetailDTO } from './GetItemDetalDTO';
import { GetItemDetailErrors } from './GetItemDetalError';
import { ItemMap } from '../../../mappers/ItemMap';


/**
 * Create Item Controller
 * A class that handles incoming HTTP requests for creating a new journal.
 * Extends the BaseController class.
 */
export class GetItemDetailController extends BaseController {
    private useCase: GetItemDetailUseCase;

    /**
     * GetItemDetailController constructor.
     * @param useCase - An instance of the GetItemDetail use case.
     */
    constructor(useCase: GetItemDetailUseCase) {
        super();
        this.useCase = useCase;
    }

    private isValidGetItemDetailDTO(dto: GetItemDetailDTO): boolean {
        return (
            typeof dto.itemId === 'string'
        );
    }

    /**
     * Executes the create journal use case based on the incoming HTTP request.
     * @param req - The express Request object containing the HTTP request data.
     * @param res - The express Response object to send the HTTP response.
     * @returns A promise that resolves to the HTTP response.
     */
    async executeImpl(req: express.Request, res: express.Response): Promise<any> {
        const dto = req.body as GetItemDetailDTO; // Assuming GetItemDetailDTO is defined somewhere in the code

        // Validate the input DTO before executing the use case
        if (!this.isValidGetItemDetailDTO(dto)) {
            return this.clientError(res, "Invalid input parameters");
        }

        try {
            const result = await this.useCase.execute(dto);
            const item = result.value.getValue();

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case GetItemDetailErrors.ItemAlreadyExistError:
                        return this.conflict(res, error.getErrorValue().message);
                    default:
                        return this.fail(res, error.getErrorValue().message);
                }
            } else {
                return this.ok(res, {res: {item: ItemMap.toDetailDTO(item)}});
            }
        } catch (err: any) {
            return this.fail(res, err);
        }
    }
}