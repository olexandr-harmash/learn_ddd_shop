import sequelizeConnection from "../config/config";
import Category from "./CateroryModel";
import Color from "./ColorModel";

import Fabric from "./FabricModel";
import ImagePath from "./ImagePathModel";
import Item from "./ItemModel";
import Proposition from "./PropositionModel";
import Quantity from "./QuantityModel";
import Shop from "./ShopModel";
import Size from "./SizeModel";

export {
    Category,
    Item,
    Fabric,
    Shop,
    ImagePath,
    Proposition,
    Quantity,
    Size,
    Color,
}

export { sequelizeConnection }

/**
 * Порядок импорта имеет значение поскольку в тестовом окружении 
 * секвалайз синхронизирует изменения.
 * 
 * Во избежании ошибки (error: relation "" does not exist)
 */
const models = {
    Category,
    Size,
    Color,
    Quantity,
    Shop,
    Proposition,
    Fabric,
    Item,
    ImagePath, 
}

export default models