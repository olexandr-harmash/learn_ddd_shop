import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { promises as fsPromises } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export interface IFileProps {
    byteArray?: Buffer;
    filePath: string;
}

export class File extends ValueObject<IFileProps> {
    get filePath(): string {
        return this.props.filePath;
    }

    getbyteArray(): Buffer | undefined {
        return this.props.byteArray
    }

    setbyteArray(byteArray: Buffer) {
        this.props.byteArray = byteArray
    }

    get isbyteArrayExists(): boolean {
        return !!this.props.byteArray || false
    }

    private constructor(props: IFileProps) {
        super(props);
    }

    public async save() {
        if (this.props.byteArray) {
            await fsPromises.writeFile(this.props.filePath, this.props.byteArray);
        }
    }

    public static create(filePath: string, byteArray?: Buffer): Result<File> {
        const propsResult = Guard.againstNullOrUndefinedBulk([
            { argument: byteArray, argumentName: 'byteArray' },
        ]);

        if (!propsResult.isSuccess) {
            return Result.fail<File>(propsResult.getErrorValue())
        }

        const fileName = byteArray ? uuidv4() + '.jpg' : '';

        const fullPath = path.join(filePath, fileName);

        const file = new File({
            filePath: fullPath,
            byteArray
        });

        return Result.ok<File>(file);
    }
}