import {
    DataTypes,
    HasOneSetAssociationMixin,
    Model,
    Optional,
} from "sequelize";

import sequelizeConnection from "../config/config";

import Item from "./ItemModel";

// Интерфейс для атрибутов Журнала
interface PropositionAttributes {
    proposition_id: string;
    item_id: string;
    size_id: string;
    color_id: string;
}

// Интерфейс для входных данных Журнала
interface PropositionInput extends Optional<PropositionAttributes, 'proposition_id'> { }

// Интерфейс для выходных данных Журнала
interface PropositionOutput extends Required<PropositionAttributes> {
}

// Модель Журнала
export default class Proposition extends Model<PropositionOutput, PropositionInput> implements PropositionAttributes {
    declare proposition_id: string;
    declare item_id: string;
    declare size_id: string;
    declare color_id: string;

    // Описание методов связей
    declare setItem: HasOneSetAssociationMixin<Item, string>;
    
    public static // Определение связей с Томами и Главами
        associate = (models: any) => {
            Item.belongsToMany(models.Color, { through: models.Proposition, foreignKey: 'item_id'});
            Item.belongsToMany(models.Size, { through: models.Proposition, foreignKey: 'item_id'});
            Proposition.belongsTo(models.Item, { foreignKey: 'item_id', targetKey: 'item_id', as: 'Item', onDelete: 'CASCADE' });
            Proposition.belongsTo(models.Color, { foreignKey: 'color_id', targetKey: 'color_id', as: 'Color' });
            Proposition.belongsTo(models.Size, { foreignKey: 'size_id', targetKey: 'size_id', as: 'Size' });
        };
    static removeVolumes: any;
}

// Определение модели Журнала
Proposition.init(
    {
        proposition_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        item_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        size_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        color_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Proposition',
        paranoid: true,
    }
);