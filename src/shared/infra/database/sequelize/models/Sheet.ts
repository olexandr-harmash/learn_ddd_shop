import {
    DataTypes,
    Model,
    Optional,
} from "sequelize";

import sequelizeConnection from "../config/config";

import Journal from "./Journal";

import { HasOneSetAssociationMixin } from "sequelize";

// Интерфейс для атрибутов Листа
interface SheetAttributes {
    id: string;
    fileName: string;
    pageNumber: number;
    // Добавьте другие атрибуты Листа, если есть
}

// Интерфейс для входных данных Листа
interface SheetInput extends Optional<SheetAttributes, 'id'> { }

// Интерфейс для выходных данных Листа
export interface SheetOutput extends Required<SheetAttributes> { 
    journalId?: string;
}

// Модель Листа
export default class Sheet extends Model<SheetOutput, SheetInput> implements SheetAttributes {
    declare id: string;
    declare fileName: string;
    declare pageNumber: number;

    declare setJournal: HasOneSetAssociationMixin<Journal, string>;

    public static // Определение связей с Томами и Главами
        associate = (models: any) => {
            Sheet.belongsTo(models.Journal, { foreignKey: 'journalId', onDelete: 'CASCADE' })
        };
}

// Определение модели Листа
Sheet.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pageNumber: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        // Добавьте другие атрибуты Листа, если есть
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Sheet',
        paranoid: true,
    }
);