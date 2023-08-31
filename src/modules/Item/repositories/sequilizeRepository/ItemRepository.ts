import { Op, Sequelize } from "sequelize";
import { Item } from "../../domain/Item";
import { ItemId } from "../../domain/ItemId";
import { ItemList } from "../../domain/ItemList";
import { ItemMap } from "../../mappers/ItemMap";
import { IImagePathRepository } from "../ImagePath";
import { GetItemCardListFilters, IItemRepository } from "../Item";
import { IFabricRepository } from "../Fabric";

export class ItemRepositoryImpl implements IItemRepository {

    private models: any;
    private imagePathRepo: IImagePathRepository;
    private fabricRepo: IFabricRepository;

    constructor(models: any, imagePathRepo: IImagePathRepository, fabricRepo: IFabricRepository) {
        this.models = models;
        this.imagePathRepo = imagePathRepo;
        this.fabricRepo = fabricRepo;
    }

    getItemDetailList(filter: GetItemCardListFilters): Promise<ItemList> {
        throw new Error("Method not implemented.");
    }

    //TODO return amount of values
    async getItemCardList(filter: GetItemCardListFilters): Promise<ItemList> {
        const ItemModel = this.models.Item;
        const baseQuery = this.createBaseQuery(filter.limit, filter.offset);

        baseQuery.where = {
            ...(filter.categoryIds?.length && {
                'category_id': {
                    [Op.in]: filter.categoryIds?.map(c => c.getStringValue())
                }
            }),
            ...(filter.price && {
                'price': {
                    [Op.between]: [filter.price.from, filter.price.to]
                }
            })
        };

        baseQuery.include.push({
            model: this.models.Color,
            where: {
                ...(filter.colorIds?.length && {
                    'color_id': {
                        [Op.in]: filter.colorIds?.map(c => c.getStringValue())
                    }
                }),
            }
        });

        baseQuery.include.push({
            model: this.models.Size,
            where: {
                ...(filter.sizeIds?.length && {
                    'size_id': {
                        [Op.in]: filter.sizeIds?.map(s => s.getStringValue())
                    }
                })
            }
        });

        const itemResult = await ItemModel.findAll(baseQuery);

        return ItemList.create(itemResult.map((i: any) => ItemMap.toDomain(i) as Item));
    }

    getItemById(id: ItemId): Promise<Item> {
        throw new Error("Method not implemented.");
    }
    getItem(id: ItemId): Promise<Item> {
        throw new Error("Method not implemented.");
    }

    async getItemDetail(id: ItemId): Promise<Item> {
        const ItemModel = this.models.Item;

        const baseDetailQuery = this.createBaseDetailsQuery();

        baseDetailQuery.where['item_id'] = id.getStringValue();

        const item = await ItemModel.findOne(baseDetailQuery);

        const itemOrError = ItemMap.toDomain(item);
        
        return itemOrError as Item;
    }

    private createBaseQuery(limit?: number, offset?: number): any {
        const models = this.models;
        return {
            where: {},
            include: [
                {
                    model: models.Fabric
                }
            ],
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
                    model: models.ImagePath,
                },
                {
                    model: models.Fabric,
                },
                {
                    model: models.Color,
                    group: ['color_id']
                },
                {
                    model: models.Size,
                    group: ['size_id']
                },
            ],
            limit,
            offset
        }
    }

    public async exists(itemId: ItemId): Promise<boolean> {
        const ItemModel = this.models.Item;
        const baseQuery = this.createBaseQuery();
        baseQuery.where['item_id'] = itemId.getStringValue();
        const item = await ItemModel.findOne(baseQuery);
        const found = !!item === true;
        return found;
    }

    public delete(itemId: ItemId): Promise<void> {
        const ItemModel = this.models.Item;
        return ItemModel.destroy({ where: { item_id: itemId.getStringValue() } });
    }

    /**
     * TODO `Result` interface adaptive error throwing
     */
    public async save(item: Item): Promise<Item> {
        const ItemModel = this.models.Item;
        const exists = await this.exists(item.itemId);
        const isNewItem = !exists;
        const rawSequelizeItem = await ItemMap.toPersistence(item);

        if (isNewItem) {
            await ItemModel.create(rawSequelizeItem);

            await this.imagePathRepo.saveList(item.imagePathList, item.itemId);
            await this.fabricRepo.save(item.fabric, item.itemId);

            return item;

        } else {
            // Save non-aggregate tables before saving the aggregate
            // so that any domain events on the aggregate get dispatched

            await ItemModel.update(rawSequelizeItem, {
                // To make sure your hooks always run, make sure to include this in
                // the query
                individualHooks: true,
                hooks: true,
                where: { item_id: item.itemId.getStringValue() }
            });

            await this.imagePathRepo.saveList(item.imagePathList, item.itemId);
            await this.fabricRepo.save(item.fabric, item.itemId);

            return item;
        }
    }
}