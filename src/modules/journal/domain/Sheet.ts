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


interface SheetProps {
    fileName: string;
    pageNumber: number;
}

export class Sheet extends Entity<SheetProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get fileName(): string {
        return this.props.fileName;
    }

    get pageNumber(): number {
        return this.props.pageNumber;
    }

    private constructor(props: SheetProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: SheetProps, id?: UniqueEntityID): Result<Sheet> {
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: props?.fileName, argumentName: 'fileName' },
            { argument: props?.pageNumber, argumentName: 'pageNumber' },
        ]);

        if (!propsResult.isSuccess) {
            return Result.fail<Sheet>(propsResult.getErrorValue())
        }

        const sheet = new Sheet({
            ...props
        }, id);

        //  const isNewlyCreated = !!id === false;

        //   if (isNewlyCreated) {
        //     sheet.addDomainEvent(new SheetCreatedEvent(sheet.sheetId))
        //   }

        return Result.ok<Sheet>(sheet);
    }
}