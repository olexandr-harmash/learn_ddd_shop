import sequelizeConnection from "../config/config";

import Chapter from "./Chapter";
import Journal from "./Journal";
import Sheet from "./Sheet";
import Volume from "./Volume";

export {
    Volume,
    Chapter,
    Journal,
    Sheet
}

export { sequelizeConnection }

const models = {
    Sheet,
    Chapter,
    Volume,
    Journal,
}

export default models