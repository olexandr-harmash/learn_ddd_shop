import {
    DataTypes,
    Model,
    Optional,
} from "sequelize";

import sequelizeConnection from "../config/config";

// Интерфейс для атрибутов Журнала
interface StorageAttributes {
    storage_id: string;
    address: string;
}

// Интерфейс для входных данных Журнала
interface StorageInput extends Optional<StorageAttributes, 'storage_id'> { }

// Интерфейс для выходных данных Журнала
export interface StorageOutput extends Required<StorageAttributes> {
 }

// Модель Журнала
export default class Storage extends Model<StorageOutput, StorageInput> implements StorageAttributes {
    declare storage_id: string;
    declare address: string;
}

// Определение модели Журнала
Storage.init(
    {
        storage_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Storage',
        paranoid: true,
    }
);