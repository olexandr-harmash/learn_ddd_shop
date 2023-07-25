import { Guard } from "../../../shared/core/Guard";

import {
    Result
} from "../../../shared/core/Result";

import {
    Entity
} from "../../../shared/domain/Entity";

import {
    UniqueEntityID
} from "../../../shared/domain/UniqueEntityID";

import { Chapter } from "./Chapter";



interface VolumeProps {
    title: string;
    number: string;
    chapters: Chapter[];
}

export class Volume extends Entity<VolumeProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get title(): string {
        return this.props.title;
    }

    get number(): string {
        return this.props.number;
    }

    get chapters(): Chapter[] {
        return this.props.chapters;
    }

    private constructor(props: VolumeProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: VolumeProps, id?: UniqueEntityID): Result<Volume> {
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: props?.title, argumentName: 'title' },
            { argument: props?.number, argumentName: 'number' },
        ]);

        if (!propsResult.isSuccess) {
            return Result.fail<Volume>(propsResult.getErrorValue())
        }

        const volume = new Volume({
            ...props
        }, id);

        //  const isNewlyCreated = !!id === false;

        //   if (isNewlyCreated) {
        //     volume.addDomainEvent(new VolumeCreatedEvent(volume.volumeId))
        //   }

        return Result.ok<Volume>(volume);
    }
}