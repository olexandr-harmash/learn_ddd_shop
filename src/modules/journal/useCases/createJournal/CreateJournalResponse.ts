import {
    AppError
} from "../../../../shared/core/AppError";

import {
    Either, Result
} from "../../../../shared/core/Result";

import {
    CreateJournalErrors
} from "./CreateJournalErrors";

export type CreateJournalResponse = Either<
    CreateJournalErrors.JournalAlreadyExistsError |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>