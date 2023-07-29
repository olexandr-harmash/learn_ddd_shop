interface CreateSheetDTO {
    byteArray: Buffer;
    pageNumber: number;
}

interface CreateJournalDTO {
    byteArray: Buffer;
    author: string;
    sheets: CreateSheetDTO[];
    coverTitle: string;
}