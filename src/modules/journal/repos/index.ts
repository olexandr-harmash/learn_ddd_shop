import models, { sequelizeConnection } from "../../../shared/infra/database/sequelize/models";
import { ChapterRepoImpl } from "./implementations/sequelizeChapterRepo";
import { JournalRepoImpl } from "./implementations/sequelizeJournalRepo";
import { SheetRepoImpl } from "./implementations/sequelizeSheetRepo";
import { VolumeRepoImpl } from "./implementations/sequelizeVolumeRepo";

const sheetRepoImpl = new SheetRepoImpl(models, sequelizeConnection)
const chapterRepoImpl = new ChapterRepoImpl(models, sequelizeConnection, sheetRepoImpl)
const volumeRepoImpl = new VolumeRepoImpl(models, sequelizeConnection, chapterRepoImpl)
const journalRepoImpl = new JournalRepoImpl(models, sequelizeConnection, volumeRepoImpl)

export {
    sheetRepoImpl,
    chapterRepoImpl,
    volumeRepoImpl,
    journalRepoImpl,
}