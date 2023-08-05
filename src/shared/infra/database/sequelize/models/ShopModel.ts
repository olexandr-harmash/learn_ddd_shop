import {
    DataTypes,
    Model,
    Optional,
} from "sequelize";

import sequelizeConnection from "../config/config";

// Интерфейс для атрибутов Журнала
interface ShopAttributes {
    shop_id: string;
    address: string;
    cordX: number;
    cordY: number;
}

// Интерфейс для входных данных Журнала
interface ShopInput extends Optional<ShopAttributes, 'shop_id'> { }

// Интерфейс для выходных данных Журнала
interface ShopOutput extends Required<ShopAttributes> {
}

// Модель Журнала
export default class Shop extends Model<ShopOutput, ShopInput> implements ShopAttributes {
    declare cordX: number;
    declare cordY: number;
    declare shop_id: string;
    declare address: string;

    public static // Определение связей с Томами и Главами
        associate = (models: any) => {
            Shop.hasMany(models.Quantity, { foreignKey: 'shopId', onDelete: 'CASCADE' });
        };
    static removeVolumes: any;
}

// Определение модели Журнала
Shop.init(
    {
        shop_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cordY: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        cordX: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Shop',
        paranoid: true,
    }
);