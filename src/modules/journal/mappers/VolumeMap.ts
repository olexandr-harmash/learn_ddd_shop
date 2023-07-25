import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import {
    Mapper
} from "../../../shared/infra/Mapper";

import {
    Volume
} from "../domain/Volume";

import { ChapterMap } from "./ChapterMap";

export class VolumeMap implements Mapper<Volume> {
    public static toDTO(volume: Volume): VolumeDTO {
        return {
            id: volume.id.toString(),
            title: volume.title,
            number: volume.number,
            chapters: volume.chapters.map(ChapterMap.toDTO)
        }
    }

    public static toPersistence(volume: Volume): any {
        return {
            id: volume.id.toString(),
            title: volume.title,
            number: volume.number,
            chapters: volume.chapters.map(ChapterMap.toPersistence)
        }
    }

    public static toDomain(raw: any): Volume | undefined | null {
        const volumeOrError = Volume.create({
            title: raw.title,
            chapters: raw.sheets.map(ChapterMap.toDomain),
            number: raw.number,
        }, new UniqueEntityID(raw.id))

        return volumeOrError.isSuccess ? volumeOrError.getValue() : null;
    }
}