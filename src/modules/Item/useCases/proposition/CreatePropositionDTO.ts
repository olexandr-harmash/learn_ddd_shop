export interface CreatePropositionDTO {
    itemId: string;
    sizeId: string;
    colorId: string;
}

export interface CreatePropositionListDTO {
    propositionList: CreatePropositionDTO[]
}