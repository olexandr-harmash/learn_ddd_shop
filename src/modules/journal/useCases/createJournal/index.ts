import { journalRepoImpl } from "../../repos";

import {
    CreateJournal
} from "./CreateJournalUseCase";

import {
    CreateJournalController
} from "./CreateJournalController";

const createJournal = new CreateJournal(journalRepoImpl)

const createJournalController = new CreateJournalController(createJournal)

export { createJournalController }