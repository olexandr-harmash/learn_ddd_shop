export interface CreateQuantityDTO {
    itemId: string;
    shopId: string;
    quantity: number;
    propositionId: string;
}

export interface CreateQuantityListDTO {
    quantityList: CreateQuantityDTO[]
}