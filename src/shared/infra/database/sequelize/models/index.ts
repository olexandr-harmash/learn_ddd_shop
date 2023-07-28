import sequelizeConnection from "../config/config";

import Journal from "./Journal";
import Sheet from "./Sheet";

export {
    Journal,
    Sheet
}

export { sequelizeConnection }

const models = {
    Journal,
    Sheet,
}

export default models