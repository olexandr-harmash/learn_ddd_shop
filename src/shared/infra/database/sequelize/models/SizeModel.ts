import {
    DataTypes,
    HasManyAddAssociationMixin,
    HasOneSetAssociationMixin,
    Model,
    Optional,
} from "sequelize";

import sequelizeConnection from "../config/config";
import Item from "./ItemModel";

// Интерфейс для атрибутов Журнала
interface SizeAttributes {
    size_id: string;
    size: string;
}

// Интерфейс для входных данных Журнала
interface SizeInput extends Optional<SizeAttributes, 'size_id'> { }

// Интерфейс для выходных данных Журнала
interface SizeOutput extends Required<SizeAttributes> {
}

// Модель Журнала
export default class Size extends Model<SizeOutput, SizeInput> implements SizeAttributes {
    declare size_id: string;
    declare size: string;

    
    public static // Определение связей с Томами и Главами
        associate = (models: any) => {
            Size.belongsToMany(models.Item, { through: models.Proposition, foreignKey: 'size_id'});
        };
}

// Определение модели Журнала
Size.init(
    {
        size_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        size: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Size',
        paranoid: true,
    }
);