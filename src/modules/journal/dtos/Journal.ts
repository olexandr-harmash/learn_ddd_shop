interface ChapterDTO {
    id: string | number;
    title?: string;
    sheets: SheetDTO[];
    pageCount: number;
    chapterNumber: number;
}

interface SheetDTO {
    id: string | number;
    fileName?: string;
    pageNumber: number;
}

interface VolumeDTO {
    id: string | number;
    title?: string;
    number: string;
    chapters: ChapterDTO[];
}

interface JournalDTO {
    id: string | number;
    title?: string;
    author: string;
    volumes: VolumeDTO[];
    coverTitle: string;
}
