import models from "../../../shared/infra/database/sequelize/models";
import { JournalRepoImpl } from "./implementations/sequelizeJournalRepo";
import { SheetRepoImpl } from "./implementations/sequelizeSheetRepo";

const sheetRepoImpl = new SheetRepoImpl(models)
const journalRepoImpl = new JournalRepoImpl(models, sheetRepoImpl)

export {
    sheetRepoImpl,
    journalRepoImpl,
}