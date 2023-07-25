import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import {
    Mapper
} from "../../../shared/infra/Mapper";

import {
    Chapter
} from "../domain/Chapter";

import {
    SheetMap
} from "./SheetMap";

export class ChapterMap implements Mapper<Chapter> {
    public static toDTO(chapter: Chapter): ChapterDTO {
        return {
            id: chapter.id.toString(),
            title: chapter.title,
            pageCount: chapter.pageCount,
            chapterNumber: chapter.chapterNumber,
            sheets: chapter.sheets.map(SheetMap.toDTO)
        }
    }

    public static toPersistence(chapter: Chapter): any {
        return {
            id: chapter.id.toString(),
            title: chapter.title,
            pageCount: chapter.pageCount,
            chapterNumber: chapter.chapterNumber,
            sheets: chapter.sheets.map(SheetMap.toPersistence)
        }
    }

    public static toDomain(raw: any): Chapter | undefined | null {
        const chapterOrError = Chapter.create({
            title: raw.title,
            sheets: raw.sheets.map(SheetMap.toDomain),
            pageCount: raw.pageCount,
            chapterNumber: raw.chapterNumber,
        }, new UniqueEntityID(raw.id))

        return chapterOrError.isSuccess ? chapterOrError.getValue() : null;
    }
}