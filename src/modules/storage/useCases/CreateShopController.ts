// Import required modules and classes
import * as express from 'express';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { CreateShopUseCase } from './CreateShopUseCase';
import { CreateShopDTO } from './CreateShopDTO';
import { CreateShopErrors } from './CreateShopErrors';


/**
 * Create Shop Controller
 * A class that handles incoming HTTP requests for creating a new journal.
 * Extends the BaseController class.
 */
export class CreateShopController extends BaseController {
    private useCase: CreateShopUseCase;

    /**
     * CreateShopController constructor.
     * @param useCase - An instance of the CreateShop use case.
     */
    constructor(useCase: CreateShopUseCase) {
        super();
        this.useCase = useCase;
    }

    private isValidCreateShopDTO(dto: CreateShopDTO): boolean {
        return (
            typeof dto.address === 'string' && 
            typeof dto.cordX === 'number' && 
            typeof dto.cordY === 'number'
        );
    }

    /**
     * Executes the create journal use case based on the incoming HTTP request.
     * @param req - The express Request object containing the HTTP request data.
     * @param res - The express Response object to send the HTTP response.
     * @returns A promise that resolves to the HTTP response.
     */
    async executeImpl(req: express.Request, res: express.Response): Promise<any> {
        const dto = req.body as CreateShopDTO; // Assuming CreateShopDTO is defined somewhere in the code
        
        // Validate the input DTO before executing the use case
        if (!this.isValidCreateShopDTO(dto)) {
            return this.clientError(res, "Invalid input parameters");
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case CreateShopErrors.ShopAlreadyExistError:
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