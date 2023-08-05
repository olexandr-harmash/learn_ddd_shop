import { ImagePath } from "../../domain/ImagePath";
import { ImagePathId } from "../../domain/ImagePathId";
import { ImagePathList } from "../../domain/ImagePathList";
import { ItemId } from "../../domain/ItemId";
import { ImagePathMap } from "../../mappers/ImagePathMap";
import { IImagePathRepository } from "../ImagePath";


export class ImagePathRepositoryImpl implements IImagePathRepository {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async saveList(imagePathList: ImagePathList, itemId: ItemId): Promise<ImagePathList> {
        return ImagePathList.create(
            await Promise.all(
                imagePathList.getItems().map(
                    async (ip) => {
                        const imagePathOrNull = await this.save(ip, itemId);
                        return imagePathOrNull as ImagePath;
                    }
                )
            )
        );
    }

    getItemById(id: ImagePathId): Promise<ImagePath> {
        throw new Error("Method not implemented.");
    }
    getItem(id: ImagePathId): Promise<ImagePath> {
        throw new Error("Method not implemented.");
    }
    getItemDetail(id: ImagePathId): Promise<ImagePath> {
        throw new Error("Method not implemented.");
    }
    getItemsDetailList(filter: any): Promise<ImagePath> {
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

    public async exists(imagePathId: ImagePathId): Promise<boolean> {
        const ImagePathModel = this.models.ImagePath;
        const baseQuery = this.createBaseQuery();
        baseQuery.where['image_path_id'] = imagePathId.getStringValue();
        const imagePath = await ImagePathModel.findOne(baseQuery);
        const found = !!imagePath === true;
        return found;
    }

    public delete(imagePathId: ImagePathId): Promise<void> {
        const ImagePathModel = this.models.ImagePath;
        return ImagePathModel.destroy({ where: { image_path_id: imagePathId.getStringValue() } });
    }

    /**
     * TODO `Result` interface adaptive error throwing
     */
    public async save(imagePath: ImagePath, itemId: ItemId): Promise<ImagePath> {
        const ImagePathModel = this.models.ImagePath;
        const exists = await this.exists(imagePath.imagePathId);
        const isNewImagePath = !exists;
        const rawSequelizeImagePath = await ImagePathMap.toPersistence(imagePath);

        if (isNewImagePath) {
            const imagePathResult = await ImagePathModel.create(rawSequelizeImagePath);

            await imagePathResult.setItem(itemId.getStringValue());

            return imagePath;

        } else {
            // Save non-aggregate tables before saving the aggregate
            // so that any domain events on the aggregate get dispatched

            const imagePathResult = await ImagePathModel.update(rawSequelizeImagePath, {
                // To make sure your hooks always run, make sure to include this in
                // the query
                individualHooks: true,
                hooks: true,
                where: { imagePath_id: imagePath.imagePathId.getStringValue() }
            });

            await imagePathResult.setItem(itemId.getStringValue());

            return imagePath;
        }
    }
}