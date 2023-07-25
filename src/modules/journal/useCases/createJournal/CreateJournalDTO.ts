interface CreateJournalDTO {
    title: string;
    author: string;
    volumes: CreateVolumeDTO[];
    coverTitle: string;
}

interface CreateChapterDTO {
    title: string;
    sheets: CreateSheetDTO[];
    pageCount: number;
    chapterNumber: number;
}

interface CreateSheetDTO {
    fileName: string;
    pageNumber: number;
}

interface CreateVolumeDTO {
    title: string;
    number: string;
    chapters: CreateChapterDTO[];
}