import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { ValueObject } from "../../../shared/domain/ValueObject";
import {
    Mapper
} from "../../../shared/infra/Mapper";

import {
    Sheet
} from "../domain/Sheet";

export class SheetMap implements Mapper<Sheet> {
    public static toDTO(sheet: Sheet): SheetDTO {
        return {
            id: sheet.id.toString(),
            fileName: sheet.fileName,
            pageNumber: sheet.pageNumber,
        }
    }

    public static toPersistence(sheet: Sheet): any {
        return {
            id: sheet.id.toString(),
            fileName: sheet.fileName,
            pageNumber: sheet.pageNumber,
        }
    }

    public static toDomain(raw: any): Sheet | undefined {
        const sheetOrError = Sheet.create({
            fileName: raw.fileName,
            pageNumber: raw.pageNumber
        }, new UniqueEntityID(raw.id))

        return sheetOrError.isSuccess ? sheetOrError.getValue() : undefined;
    }
}