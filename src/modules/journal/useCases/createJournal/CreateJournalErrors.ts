import {
    Result
} from "../../../../shared/core/Result"

import {
    UseCaseError
} from "../../../../shared/core/UseCaseError"


export namespace CreateJournalErrors {
    export class JournalAlreadyExistsError extends Result<UseCaseError> {
        constructor(baseUserId: string) {
            super(false, {
                message: `Member for ${baseUserId} already exists.`
            } as UseCaseError)
        }
    }
}