export interface ItemFiltersDTO {
    categoryIds: string[];
    price: {
        from: number;
        to: number;
    }
    colorIds: string[];
    sizeIds: string[];
}

interface Color  {
    color_id: string,
    color: string
}

interface Size  {
    size_id: string,
    size: string
}

export interface GetItemCardListResult {
    res: {
        item_id: string,
        colors: Color[],
        sizes: Size[]
    }
}