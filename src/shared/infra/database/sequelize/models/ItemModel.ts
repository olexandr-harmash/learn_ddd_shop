import {
    DataTypes,
    Model,
    Optional,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyRemoveAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyRemoveAssociationsMixin,
} from "sequelize";

import sequelizeConnection from "../config/config";

import ImagePath, { ImagePathOutput } from "./ImagePathModel";

// Интерфейс для атрибутов Журнала
interface ItemAttributes {
    item_id: string;
    title: string;
    description: string;
    price: number;
    sale: number;
    titleImagePath: string;
    category_id: string;
}

// Интерфейс для входных данных Журнала
interface ItemInput extends Optional<ItemAttributes, 'item_id'> { }

// Интерфейс для выходных данных Журнала
interface ItemOutput extends Required<ItemAttributes> {
    sheets?: ImagePathOutput[];
}

// Модель Журнала
export default class Item extends Model<ItemOutput, ItemInput> implements ItemAttributes {
    declare title: string;
    declare price: number;
    declare sale: number;
    declare item_id: string;
    declare description: string;
    declare titleImagePath: string;
    declare category_id: string;

    // Описание методов связей
    declare getImagePaths: HasManyGetAssociationsMixin<ImagePath>;
    declare addImagePath: HasManyAddAssociationMixin<ImagePath, string>;
    declare removeImagePath: HasManyRemoveAssociationMixin<ImagePath, string>;
    declare removeImagePaths: HasManyRemoveAssociationsMixin<ImagePath, string>;
    declare setImagePath: HasManySetAssociationsMixin<ImagePath, string>;

    public static // Определение связей с Томами и Главами
        associate = (models: any) => {
            Item.hasMany(models.Proposition, { foreignKey: 'item_id', onDelete: 'CASCADE' });
            Item.hasMany(models.ImagePath, { foreignKey: 'itemId', onDelete: 'CASCADE' });
            Item.hasOne(models.Fabric, { foreignKey: 'itemId', onDelete: 'CASCADE' });
        };
}

// Определение модели Журнала
Item.init(
    {
        item_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        titleImagePath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        sale: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Item',
        paranoid: true,
    }
);