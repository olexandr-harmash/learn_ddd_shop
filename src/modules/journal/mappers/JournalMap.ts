import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

import {
    Mapper
} from "../../../shared/infra/Mapper";

import {
    Journal
} from "../domain/Journal";

import { SheetMap } from "./SheetMap";

export class JournalMap implements Mapper<Journal> {
    public static toDTO(journal: Journal): JournalDTO {
        return {
            id: journal.id.toValue(),
            title: journal.title,
            author: journal.author,
            coverTitle: journal.coverTitle,
            sheets: journal.sheets.map(SheetMap.toDTO)
        }
    }

    public static toPersistence(journal: Journal): any {
        return {
            id: journal.id.toString(),
            title: journal.title,
            author: journal.author,
            coverTitle: journal.coverTitle,
            sheets: journal.sheets.map(SheetMap.toPersistence)
        }
    }

    public static toDomain(raw: any): Journal | undefined {
        const journalOrError = Journal.create({
            title: raw.title,
            sheets: raw.sheets.map(SheetMap.toDomain),
            author: raw.author,
            coverTitle: raw.coverTitle,
        }, new UniqueEntityID(raw.id))

        return journalOrError.isSuccess ? journalOrError.getValue() : undefined;
    }
}