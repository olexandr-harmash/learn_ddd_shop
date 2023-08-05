// Import required modules and classes
import * as express from 'express';
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { GetItemCardListUseCase } from './GetItemCardListUseCase';
import { GetItemCardListResult, ItemFiltersDTO } from './GetItemCardListDTO';
import { Item } from '../../../domain/Item';
import { ItemMap } from '../../../mappers/ItemMap';

/**
 * Create Item Controller
 * A class that handles incoming HTTP requests for creating a new journal.
 * Extends the BaseController class.
 */
export class GetItemCardListController extends BaseController {
    private useCase: GetItemCardListUseCase;

    /**
     * CreateItemController constructor.
     * @param useCase - An instance of the CreateItem use case.
     */
    constructor(useCase: GetItemCardListUseCase) {
        super();
        this.useCase = useCase;
    }

    private isValidCreateItemDTO(dto: ItemFiltersDTO): boolean {
        return (
            true
        );
    }

    /**
     * Executes the create journal use case based on the incoming HTTP request.
     * @param req - The express Request object containing the HTTP request data.
     * @param res - The express Response object to send the HTTP response.
     * @returns A promise that resolves to the HTTP response.
     */
    async executeImpl(req: express.Request, res: express.Response): Promise<any> {
        const dto = req.body as ItemFiltersDTO; // Assuming CreateItemDTO is defined somewhere in the code

        // Validate the input DTO before executing the use case
        if (!this.isValidCreateItemDTO(dto)) {
            return this.clientError(res, "Invalid input parameters");
        }

        try {
            const result = await this.useCase.execute(dto);
            const items = result.value.getValue().getItems();

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    default:
                        return this.fail(res, error.getErrorValue().message);
                }
            } else {
                return this.ok<GetItemCardListResult>(res, {
                    res: items.map((i: Item) => {
                        return ItemMap.toCardDTO(i);
                    })
                });
            }
        } catch (err: any) {
            return this.fail(res, err);
        }
    }
}