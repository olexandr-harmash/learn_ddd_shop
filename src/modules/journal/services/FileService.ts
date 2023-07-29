/**
 * Interface for a File Service that provides methods for file-related operations.
 */
export interface IFileService {
    /**
     * Changes the current working directory to the specified path.
     * @param pathToResolve - The relative or absolute path to resolve and set as the current directory.
     */
    cd(pathToResolve: string): void;

    /**
     * Creates a new directory with the given name in the current working directory.
     * @param name - The name of the directory to create.
     * @returns A Promise that resolves to the name of the created directory, or the name directly if synchronous.
     * @throws Error if there is an issue creating the directory.
     */
    mkdir(name: string): Promise<string> | string;

    /**
     * Creates a new file with the provided data and name in the current working directory.
     * @param data - The buffer containing the data to be written to the file.
     * @param name - The name of the file to create.
     * @returns A Promise that resolves to the name of the created file, or the name directly if synchronous.
     * @throws Error if there is an issue creating the file.
     */
    touch(data: Buffer, name: string): Promise<string> | string;
}
