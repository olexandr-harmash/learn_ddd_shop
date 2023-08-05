import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/infra/Mapper";
import { Shop } from "../domain/Shop";
import { ShopAddress } from "../domain/ShopAddress";


export class ShopMap implements Mapper<Shop> {
    public static toPersistence(shop: Shop): any {
        return {
            shop_id: shop.ShopId.getStringValue(),
            address: shop.address.value,
            cordX: shop.cordX,
            cordY: shop.cordY,
        }
    }

    public static toDomain(raw: any): Shop | null {
        const shopAddressOrError = ShopAddress.create({value: raw.address});

        shopAddressOrError.isFailure ? console.log(shopAddressOrError.getErrorValue()) : '';

        const shopOrError = Shop.create({
            address: shopAddressOrError.getValue() as ShopAddress,
            cordX: raw.cordX,
            cordY: raw.cordY
        }, new UniqueEntityID(raw.shop_id));

        shopOrError.isFailure ? console.log(shopOrError.getErrorValue()) : '';

        return shopOrError.isSuccess ? shopOrError.getValue() as Shop : null;
    }
}