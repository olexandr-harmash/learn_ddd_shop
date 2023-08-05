export interface GetItemDetailDTO {
    itemId: string;
}

export interface GetItemDeteilsResult {
    res: {
        item: {
            sale: number;
            price: number;
            title: string;
            description: string;
            imagePathList: string[];
            fabric: {
                cotton: number;
                poliester: number;
            };
        },
    }
}