import {
    Guard
} from "../../../shared/core/Guard";

import {
    Result
} from "../../../shared/core/Result";

import {
    AggregateRoot
} from "../../../shared/domain/AggregateRoot";

import {
    UniqueEntityID
} from "../../../shared/domain/UniqueEntityID";

import { File as FileValueObj } from "./File";

import { Sheets } from "./Sheets";

interface JournalProps {
    image: FileValueObj;
    author: string;
    sheets?: Sheets;
    coverTitle: string;
}

export class Journal extends AggregateRoot<JournalProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get image(): FileValueObj {
        return this.props.image;
    }

    get author(): string {
        return this.props.author;
    }

    get sheets(): Sheets {
        return this.props.sheets ?? Sheets.create([]);
    }

    get coverTitle(): string {
        return this.props.coverTitle;
    }

    private constructor(props: JournalProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: JournalProps, id?: UniqueEntityID): Result<Journal> {
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: props?.image, argumentName: 'image' },
            { argument: props?.author, argumentName: 'author' },
            { argument: props?.coverTitle, argumentName: 'coverTitle' },
        ]);

        if (!propsResult.isSuccess) {
            return Result.fail<Journal>(propsResult.getErrorValue())
        }

        const journal = new Journal({
            ...props
        }, id);

        //  const isNewlyCreated = !!id === false;

        //   if (isNewlyCreated) {
        //     journal.addDomainEvent(new JournalCreatedEvent(journal.journalId))
        //   }

        return Result.ok<Journal>(journal);
    }
}