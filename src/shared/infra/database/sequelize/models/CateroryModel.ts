import {
    DataTypes,
    Model,
    Optional,
} from "sequelize";

import sequelizeConnection from "../config/config";

// Интерфейс для атрибутов Журнала
interface CategoryAttributes {
    category_id: string;
    parent_category_id: string;
    category: string;
}

// Интерфейс для входных данных Журнала
interface CategoryInput extends Optional<CategoryAttributes, 'category_id'> { }

// Интерфейс для выходных данных Журнала
interface CategoryOutput extends Required<CategoryAttributes> {
}

// Модель Журнала
export default class Category extends Model<CategoryOutput, CategoryInput> implements CategoryAttributes {
    declare category_id: string;
    declare parent_category_id: string;
    declare category: string;

    public static // Определение связей с Томами и Главами
        associate = (models: any) => {
        };
}

// Определение модели Журнала
Category.init(
    {
        category_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        parent_category_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Category',
        paranoid: true,
    }
);