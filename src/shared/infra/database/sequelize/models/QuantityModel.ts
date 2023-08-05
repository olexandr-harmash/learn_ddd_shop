import {
    DataTypes,
    HasOneSetAssociationMixin,
    Model,
    Optional,
} from "sequelize";

import sequelizeConnection from "../config/config";
import Proposition from "./PropositionModel";
import Shop from "./ShopModel";

// Интерфейс для атрибутов Журнала
interface QuantityAttributes {
    quantity_id: string;
    quantity: number;
}

// Интерфейс для входных данных Журнала
interface QuantityInput extends Optional<QuantityAttributes, 'quantity_id'> { }

// Интерфейс для выходных данных Журнала
export interface QuantityOutput extends Required<QuantityAttributes> {
 }

// Модель Журнала
export default class Quantity extends Model<QuantityOutput, QuantityInput> implements QuantityAttributes {
    declare quantity_id: string;
    declare quantity: number;

    // Описание методов связей
    declare setProposition: HasOneSetAssociationMixin<Proposition, string>;
    declare setPropositionList: HasOneSetAssociationMixin<Proposition, string>;
    declare setShop: HasOneSetAssociationMixin<Shop, string>;
    declare setShopList: HasOneSetAssociationMixin<Shop, string>;

    public static // Определение связей с Томами и Главами
        associate = (models: any) => {
            Quantity.belongsTo(models.Shop, { foreignKey: 'shopId', onDelete: 'CASCADE' });
            Quantity.belongsTo(models.Proposition, { foreignKey: 'propositionId', onDelete: 'CASCADE' });
        };
}

// Определение модели Журнала
Quantity.init(
    {
        quantity_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Quantity',
        paranoid: true,
    }
);