import { Item } from "../../../modules/Item/domain/Item";
import { ItemMap } from "../../../modules/Item/mappers/ItemMap";
import { getItemCardListUseCase } from "../../../modules/Item/useCases/item";
import { Result } from "../../core/Result";
import { v1Router, v1StaticRouter } from "./api/v1";
import { app } from "./app";

app.use("/api/v1", v1Router);

app.use("/clothes", v1StaticRouter);