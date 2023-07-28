interface SheetDTO {
    id: string | number;
    fileName?: string;
    pageNumber: number;
}

interface JournalDTO {
    id: string | number;
    title?: string;
    author: string;
    sheets: SheetDTO[];
    coverTitle: string;
}
