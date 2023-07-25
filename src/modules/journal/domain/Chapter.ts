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
import { Sheet } from "./Sheet";


interface ChapterProps {
    title: string;
    sheets: Sheet[];
    pageCount: number;
    chapterNumber: number;
}

export class Chapter extends Entity<ChapterProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get sheets(): Sheet[] {
        return this.props.sheets;
    }

    get title(): string {
        return this.props.title;
    }

    get pageCount(): number {
        return this.props.pageCount;
    }

    get chapterNumber(): number {
        return this.props.chapterNumber;
    }

    private constructor(props: ChapterProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: ChapterProps, id?: UniqueEntityID): Result<Chapter> {
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: props?.title, argumentName: 'title' },
            { argument: props?.pageCount, argumentName: 'pageCount' },
            { argument: props?.chapterNumber, argumentName: 'chapterNumber' },
        ]);

        if (!propsResult.isSuccess) {
            return Result.fail<Chapter>(propsResult.getErrorValue())
        }

        const chapter = new Chapter({
            ...props
        }, id);

        //  const isNewlyCreated = !!id === false;

        //   if (isNewlyCreated) {
        //     chapter.addDomainEvent(new ChapterCreatedEvent(chapter.chapterId))
        //   }

        return Result.ok<Chapter>(chapter);
    }
}