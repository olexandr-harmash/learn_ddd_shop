interface CreateSheetDTO {
    fileName: string;
    pageNumber: number;
}

interface CreateJournalDTO {
    title: string;
    author: string;
    sheets: CreateSheetDTO[];
    coverTitle: string;
}