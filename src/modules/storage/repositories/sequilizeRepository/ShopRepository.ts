import { Shop } from "../../domain/Shop";
import { ShopId } from "../../domain/ShopId";
import { ShopMap } from "../../mappers/ShopMap";
import { IShopRepository } from "../Shop";

export class ShopRepositoryImpl implements IShopRepository {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    getShopById(id: ShopId): Promise<Shop> {
        throw new Error("Method not implemented.");
    }
    getShop(id: ShopId): Promise<Shop> {
        throw new Error("Method not implemented.");
    }
    getShopDetail(id: ShopId): Promise<Shop> {
        throw new Error("Method not implemented.");
    }
    getShopsDetailList(filter: any): Promise<Shop> {
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

    public async exists(shopId: ShopId): Promise<boolean> {
        const ShopModel = this.models.Shop;
        const baseQuery = this.createBaseQuery();
        baseQuery.where['shop_id'] = shopId.getStringValue();
        const shop = await ShopModel.findOne(baseQuery);
        const found = !!shop === true;
        return found;
    }

    public delete(shopId: ShopId): Promise<void> {
        const ShopModel = this.models.Shop;
        return ShopModel.destroy({ where: { shop_id: shopId.getStringValue() } });
    }

    /**
     * TODO `Result` interface adaptive error throwing
     */
    public async save(shop: Shop): Promise<Shop> {
        const ShopModel = this.models.Shop;
        const exists = await this.exists(shop.ShopId);
        const isNewShop = !exists;
        const rawSequelizeShop = await ShopMap.toPersistence(shop);

        if (isNewShop) {
            const shopResult = await ShopModel.create(rawSequelizeShop);
           
            const shopOrNull = await ShopMap.toDomain(shopResult);

            if (!shopOrNull) {
                throw new Error('Can`t create domain entity');
            }

            return shopOrNull;

        } else {
            // Save non-aggregate tables before saving the aggregate
            // so that any domain events on the aggregate get dispatched

            const shopResult = await ShopModel.update(rawSequelizeShop, {
                // To make sure your hooks always run, make sure to include this in
                // the query
                individualHooks: true,
                hooks: true,
                where: { shop_id: shop.ShopId.getStringValue() }
            });

            const shopOrNull = await ShopMap.toDomain(shopResult);

            if (!shopOrNull) {
                throw new Error('Can`t create domain entity');
            }

            return shopOrNull;
        }
    }
}