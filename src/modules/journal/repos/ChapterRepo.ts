import { Chapter } from "../domain/Chapter";

export interface IChapterRepo {
    exists(chapterId: number): Promise<boolean>;
    saveCollection(chapter: Chapter[]): Promise<Chapter[]>;
}