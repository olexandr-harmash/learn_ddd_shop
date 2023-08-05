import {
    DataTypes,
    HasOneSetAssociationMixin,
    Model,
    Optional,
} from "sequelize";

import sequelizeConnection from "../config/config";
import Item from "./ItemModel";

// Интерфейс для атрибутов Журнала
interface FabricAttributes {
    fabric_id: string;
    cotton: number;
    poliester: number;
}

// Интерфейс для входных данных Журнала
interface FabricInput extends Optional<FabricAttributes, 'fabric_id'> { }

// Интерфейс для выходных данных Журнала
interface FabricOutput extends Required<FabricAttributes> {
}

// Модель Журнала
export default class Fabric extends Model<FabricOutput, FabricInput> implements FabricAttributes {
    declare fabric_id: string;
    declare cotton: number;
    declare poliester: number;

    // Описание методов связей
    declare setItem: HasOneSetAssociationMixin<Item, string>;

    public static // Определение связей с Томами и Главами
        associate = (models: any) => {
            Fabric.belongsTo(models.Item, { foreignKey: 'itemId', onDelete: 'CASCADE' });
        };
}

// Определение модели Журнала
Fabric.init(
    {
        fabric_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        cotton: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        poliester: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Fabric',
        paranoid: true,
    }
);