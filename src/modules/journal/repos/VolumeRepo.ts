import { Volume } from "../domain/Volume";


export interface IVolumeRepo {
    exists(volumeId: number): Promise<boolean>;
    saveCollection(volume: Volume[]): Promise<Volume[]>;
}