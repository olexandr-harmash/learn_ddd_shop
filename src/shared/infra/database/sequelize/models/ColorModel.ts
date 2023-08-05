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
interface ColorAttributes {
    color_id: string;
    color: string;
}

// Интерфейс для входных данных Журнала
interface ColorInput extends Optional<ColorAttributes, 'color_id'> { }

// Интерфейс для выходных данных Журнала
interface ColorOutput extends Required<ColorAttributes> {
}

// Модель Журнала
export default class Color extends Model<ColorOutput, ColorInput> implements ColorAttributes {
    declare color_id: string;
    declare color: string;
    
    public static // Определение связей с Томами и Главами
        associate = (models: any) => {
            Color.belongsToMany(models.Item, { through: models.Proposition, foreignKey: 'color_id'});
        };
    static removeVolumes: any;
}

// Определение модели Журнала
Color.init(
    {
        color_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Color',
        paranoid: true,
    }
);