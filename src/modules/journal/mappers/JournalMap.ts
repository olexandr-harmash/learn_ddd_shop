import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

import {
    Mapper
} from "../../../shared/infra/Mapper";

import {
    Journal
} from "../domain/Journal";

import {
    VolumeMap
} from "./VolumeMap";



export class JournalMap implements Mapper<Journal> {
    public static toDTO(journal: Journal): JournalDTO {
        return {
            id: journal.id.toValue(),
            title: journal.title,
            author: journal.author,
            coverTitle: journal.coverTitle,
            volumes: journal.volumes.map(VolumeMap.toDTO)
        }
    }

    public static toPersistence(journal: Journal): any {
        return {
            id: journal.id.toString(),
            title: journal.title,
            author: journal.author,
            coverTitle: journal.coverTitle,
            volumes: journal.volumes.map(VolumeMap.toPersistence)
        }
    }

    public static toDomain(raw: any): Journal | undefined | null {
        const journalOrError = Journal.create({
            title: raw.title,
            volumes: raw.volumes.map(VolumeMap.toDomain),
            author: raw.author,
            coverTitle: raw.coverTitle,
        }, new UniqueEntityID(raw.id))

        return journalOrError.isSuccess ? journalOrError.getValue() : null;
    }
}