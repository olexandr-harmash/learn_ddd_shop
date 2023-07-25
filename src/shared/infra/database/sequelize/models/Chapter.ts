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
import Volume from "./Volume";
import Sheet from "./Sheet";

// Интерфейс для атрибутов Главы
interface ChapterAttributes {
    id: string;
    chapterNumber: number;
    pageCount: number;
    title: string;
}

// Интерфейс для входных данных Главы
interface ChapterInput extends Optional<ChapterAttributes, 'id'> { }

// Интерфейс для выходных данных Главы
interface ChapterOutput extends Required<ChapterAttributes> { }

// Модель Главы
export default class Chapter extends Model<ChapterOutput, ChapterInput> implements ChapterAttributes {
    declare id: string
    declare chapterNumber: number;
    declare pageCount: number;
    declare title: string;

    // Описание методов связей
    declare getVolume: BelongsToGetAssociationMixin<Volume>;
    declare setVolume: BelongsToSetAssociationMixin<Volume, number>;
    declare createVolume: BelongsToCreateAssociationMixin<Volume>;
    declare getSheets: HasManyGetAssociationsMixin<Sheet>;
    declare addSheet: HasManyAddAssociationMixin<Sheet, number>;
    declare removeSheet: HasManyRemoveAssociationMixin<Sheet, number>;
    declare removeSheets: HasManyRemoveAssociationsMixin<Sheet, number>;
    declare setSheets: HasManySetAssociationsMixin<Sheet, number>;

    public static associate = (models: any) => {
        Chapter.belongsTo(models.Volume, { foreignKey: 'volumeId', onDelete: 'CASCADE' });
        Chapter.hasMany(models.Sheet, { foreignKey: 'chapterId', onDelete: 'CASCADE' });
    };
}

// Определение модели Главы
Chapter.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        chapterNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pageCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Chapter',
        paranoid: false, // Установите в true, если требуется мягкое удаление
    }
);