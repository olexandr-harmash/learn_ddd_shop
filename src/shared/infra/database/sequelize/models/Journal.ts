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
import Volume from "./Volume";

// Интерфейс для атрибутов Журнала
interface JournalAttributes {
    id: string;
    title: string;
    author: string;
    coverTitle: string;
}

// Интерфейс для входных данных Журнала
interface JournalInput extends Optional<JournalAttributes, 'id'> { }

// Интерфейс для выходных данных Журнала
interface JournalOutput extends Required<JournalAttributes> { }

// Модель Журнала
export default class Journal extends Model<JournalOutput, JournalInput> implements JournalAttributes {
    declare id: string;
    declare title: string;
    declare author: string;
    declare coverTitle: string;

    // Описание методов связей
    declare getVolumes: HasManyGetAssociationsMixin<Volume>;
    declare addVolume: HasManyAddAssociationMixin<Volume, number>;
    declare removeVolume: HasManyRemoveAssociationMixin<Volume, number>;
    declare removeVolumes: HasManyRemoveAssociationsMixin<Volume, number>;
    declare setVolumes: HasManySetAssociationsMixin<Volume, number>;

    public static // Определение связей с Томами и Главами
        associate = (models: any) => {
            Journal.hasMany(models.Volume, { foreignKey: 'journalId', onDelete: 'CASCADE' });
        };
    static removeVolumes: any;
}

// Определение модели Журнала
Journal.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        coverTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Journal',
        paranoid: true,
    }
);