import {
    DataTypes,
    HasOneSetAssociationMixin,
    Model,
    Optional,
} from "sequelize";

import sequelizeConnection from "../config/config";
import Item from "./ItemModel";

// Интерфейс для атрибутов Журнала
interface ImagePathAttributes {
    image_path_id: string;
    path: string;
}

// Интерфейс для входных данных Журнала
interface ImagePathInput extends Optional<ImagePathAttributes, 'image_path_id'> { }

// Интерфейс для выходных данных Журнала
export interface ImagePathOutput extends Required<ImagePathAttributes> {
 }

// Модель Журнала
export default class ImagePath extends Model<ImagePathOutput, ImagePathInput> implements ImagePathAttributes {
    declare image_path_id: string;
    declare path: string;

    // Описание методов связей
    declare setItem: HasOneSetAssociationMixin<Item, string>;

    public static // Определение связей с Томами и Главами
        associate = (models: any) => {
            ImagePath.belongsTo(models.Item, { foreignKey: 'itemId', onDelete: 'CASCADE' });
        };
}

// Определение модели Журнала
ImagePath.init(
    {
        image_path_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'ItemImage',
        paranoid: true,
    }
);