import * as express from 'express'

import { BaseController } from "../../../../shared/infra/http/models/BaseController";

export class FetchJournalsByFilterController extends BaseController {
    private useCase: any;

    constructor(useCase: any) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(req: express.Request, res: express.Response): Promise<any> {
        let dto: any = {};

        try {
            // const result = await this.useCase.execute(dto);

            // if (result.isLeft()) {
            //     const error = result.value;

            //     switch (error.constructor) {
            //         default:
            //             return this.fail(res, error.getErrorValue().message);
            //     }

            // } else {
            //     return this.ok(res);
            // }
            return this.ok(res);

        } catch (err: any) {
            return this.fail(res, err)
        }
    }
}