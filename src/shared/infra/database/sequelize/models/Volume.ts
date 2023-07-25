import {
    DataTypes,
    Model,
    Optional,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyRemoveAssociationMixin,
    HasManySetAssociationsMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
    HasManyRemoveAssociationsMixin,
} from "sequelize";

import sequelizeConnection from "../config/config";

import Chapter from "./Chapter";

import Journal from "./Journal";

// Интерфейс для атрибутов Тома
interface VolumeAttributes {
    id: string;
    title: string;
    number: string;
    // Добавьте другие атрибуты, если есть
}

// Интерфейс для входных данных Тома
interface VolumeInput extends Optional<VolumeAttributes, 'id'> {
    journalId: number;
}

// Интерфейс для выходных данных Тома
interface VolumeOutput extends Required<VolumeAttributes> { }

// Модель Тома
export default class Volume extends Model<VolumeOutput, VolumeInput> implements VolumeAttributes {
    declare id: string;
    declare title: string;
    declare number: string;
    // Добавьте другие атрибуты, если есть

    // Описание методов связей
    declare getJournal: BelongsToGetAssociationMixin<Journal>;
    declare setJournal: BelongsToSetAssociationMixin<Journal, number>;
    declare createJournal: BelongsToCreateAssociationMixin<Journal>;
    declare getChapters: HasManyGetAssociationsMixin<Chapter>;
    declare addChapter: HasManyAddAssociationMixin<Chapter, number>;
    declare removeChapter: HasManyRemoveAssociationMixin<Chapter, number>;
    declare removeChapters: HasManyRemoveAssociationsMixin<Chapter, number>;
    declare setChapters: HasManySetAssociationsMixin<Chapter, number>;

    public static // Определение связей с Журналом и Главами
        associate = (models: any) => {
            Volume.belongsTo(models.Journal, { foreignKey: 'journalId', onDelete: 'CASCADE' });
            Volume.hasMany(models.Chapter, { foreignKey: 'volumeId', onDelete: 'CASCADE' });
        };
}

// Определение модели Тома
Volume.init(
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
        number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Добавьте другие атрибуты, если есть
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Volume',
        timestamps: false,
    }
);