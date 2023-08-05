export interface ItemDetailDTO {
    sale: number;
    price: number;
    title: string;
    description: string;
    imagePathList: string[];
    fabric: {
        cotton: number;
        poliester: number;
    };
    colors: string[]
    sizes: string[]
}