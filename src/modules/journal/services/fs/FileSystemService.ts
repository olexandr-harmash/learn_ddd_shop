import { IFileService } from "../FileService";
import { promises as fsPromises } from 'fs';
import path from 'path';

/**
 * Implementation of the IFileService interface for file-related operations.
 */
export class FileServiceImpl implements IFileService {
    private _directoryPath: string = "./";

    /**
     * Changes the current working directory to the specified path.
     * @param pathToResolve - The relative or absolute path to resolve and set as the current directory.
     */
    cd(pathToResolve: string): void {
        this._directoryPath = path.resolve(this._directoryPath, pathToResolve);
    }

    /**
     * Creates a new directory with the given name in the current working directory.
     * @param name - The name of the directory to create.
     * @returns The name of the created directory.
     * @throws Error if there is an issue creating the directory.
     */
    async mkdir(name: string): Promise<string> {
        try {
            await fsPromises.mkdir(path.join(this._directoryPath, name), { recursive: true });
            return name;
        } catch (error: any) {
            throw new Error(`Error creating directory: ${error.message}`);
        }
    }
    
    /**
     * Creates a new file with the provided data and name in the current working directory.
     * @param data - The buffer containing the data to be written to the file.
     * @param fileName - The name of the file to create.
     * @returns The name of the created file.
     * @throws Error if there is an issue creating the file.
     */
    async touch(data: Buffer, fileName: string): Promise<string> {
        try {
            await fsPromises.writeFile(path.join(this._directoryPath, fileName), data);
            return fileName;
        } catch (error: any) {
            throw new Error(`Error creating file: ${error.message}`);
        }
    }
}