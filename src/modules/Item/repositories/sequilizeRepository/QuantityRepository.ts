import { Quantity } from "../../domain/Quantity";
import { QuantityId } from "../../domain/QuantityId";
import { QuantityList } from "../../domain/QuantityList";
import { QuantityMap } from "../../mappers/QuantityMap";

import { IImagePathRepository } from "../ImagePath";
import { IQuantityRepository } from "../Quantity";

export class QuantityRepositoryImpl implements IQuantityRepository {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }
    async saveList(quantityList: QuantityList): Promise<QuantityList> {
        return QuantityList.create(
            await Promise.all(
                quantityList.getItems().map(
                    async (q) => {
                        const propositionOrNull = await this.save(q);
                        return propositionOrNull as Quantity;
                    }
                )
            )
        );
    }
    getItemById(id: QuantityId): Promise<Quantity> {
        throw new Error("Method not implemented.");
    }
    getItem(id: QuantityId): Promise<Quantity> {
        throw new Error("Method not implemented.");
    }
    getItemDetail(id: QuantityId): Promise<Quantity> {
        throw new Error("Method not implemented.");
    }
    getItemsDetailList(filter: any): Promise<Quantity> {
        throw new Error("Method not implemented.");
    }
    
    private createBaseQuery(limit?: number, offset?: number): any {
        const models = this.models;
        return {
            where: {},
            include: [],
            limit,
            offset
        }
    }

    private createBaseDetailsQuery(limit?: number, offset?: number): any {
        const models = this.models;
        return {
            where: {},
            include: [
                {
                    model: models.Proposition,
                    as: 'Proposition',
                    include: [
                        { model: models.Quantity, as: 'Quantity' }
                    ]
                }
            ],
            limit,
            offset
        }
    }

    public async exists(quantityId: QuantityId): Promise<boolean> {
        const QuantityModel = this.models.Quantity;
        const baseQuery = this.createBaseQuery();
        baseQuery.where['quantity_id'] = quantityId.getStringValue();
        const quantity = await QuantityModel.findOne(baseQuery);
        const found = !!quantity === true;
        return found;
    }

    public delete(quantityId: QuantityId): Promise<void> {
        const QuantityModel = this.models.Quantity;
        return QuantityModel.destroy({ where: { quantity_id: quantityId.getStringValue() } });
    }

    /**
     * TODO `Result` interface adaptive error throwing
     */
    public async save(quantity: Quantity): Promise<Quantity> {
        const QuantityModel = this.models.Quantity;
        const exists = await this.exists(quantity.quantityId);
        const isNewQuantity = !exists;
        const rawSequelizeQuantity = await QuantityMap.toPersistence(quantity);

        if (isNewQuantity) {
            const quantityResult = await QuantityModel.create(rawSequelizeQuantity);

            await quantityResult.setShop(quantity.shopId.getStringValue());
            await quantityResult.setProposition(quantity.propositionId.getStringValue());

            return quantity;
        } else {
            // Save non-aggregate tables before saving the aggregate
            // so that any domain events on the aggregate get dispatched

            const quantityResult = await QuantityModel.update(rawSequelizeQuantity, {
                // To make sure your hooks always run, make sure to include this in
                // the query
                individualHooks: true,
                hooks: true,
                where: { quantity_id: quantity.quantityId.getStringValue() }
            });

            await quantityResult.setShop(quantity.shopId.getStringValue());
            await quantityResult.setProposition(quantity.propositionId.getStringValue());

            return quantity;
        }
    }
}