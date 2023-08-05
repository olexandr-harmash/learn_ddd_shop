import { Fabric } from "../../domain/Fabric";
import { FabricId } from "../../domain/FabricId";
import { IFabricRepository } from "../Fabric";
import { FabricMap } from "../../mappers/FabricMap";
import { ItemId } from "../../domain/ItemId";

export class FabricRepositoryImpl implements IFabricRepository {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async getItemById(id: FabricId): Promise<Fabric> {
        const ItemModel = this.models.Item;
        const baseQuery = this.createBaseQuery();
        baseQuery.where['item_id'] = id.getStringValue();
        const item = await ItemModel.findOne(baseQuery);
        const found = !!item === true;
        return item;
    }
    
    getItem(id: FabricId): Promise<Fabric> {
        throw new Error("Method not implemented.");
    }
    getItemDetail(id: FabricId): Promise<Fabric> {
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
            ],
            limit,
            offset
        }
    }

    public async exists(fabricId: FabricId): Promise<boolean> {
        const FabricModel = this.models.Fabric;
        const baseQuery = this.createBaseQuery();
        baseQuery.where['fabric_id'] = fabricId.getStringValue();
        const fabric = await FabricModel.findOne(baseQuery);
        const found = !!fabric === true;
        return found;
    }

    public delete(fabricId: FabricId): Promise<void> {
        const FabricModel = this.models.Fabric;
        return FabricModel.destroy({ where: { fabric_id: fabricId.getStringValue() } });
    }

    /**
     * TODO `Result` interface adaptive error throwing
     */
    public async save(fabric: Fabric, itemId: ItemId): Promise<Fabric> {
        const FabricModel = this.models.Fabric;
        const exists = await this.exists(fabric.FabricId);
        const isNewFabric = !exists;
        const rawSequelizeFabric = await FabricMap.toPersistence(fabric);

        if (isNewFabric) {
            const fabricResult = await FabricModel.create(rawSequelizeFabric);

            await fabricResult.setItem(itemId.getStringValue());

            return fabric;
        } else {
            // Save non-aggregate tables before saving the aggregate
            // so that any domain events on the aggregate get dispatched

            const fabricResult = await FabricModel.update(rawSequelizeFabric, {
                // To make sure your hooks always run, make sure to include this in
                // the query
                individualHooks: true,
                hooks: true,
                where: { fabric_id: fabric.FabricId.getStringValue() }
            });

            await fabricResult.setItem(itemId.getStringValue());

            return fabric;
        }
    }
}