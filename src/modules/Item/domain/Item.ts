import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

import { ItemId } from "./ItemId";
import { ImagePathList } from "./ImagePathList";
import { ItemDescription } from "./ItemDescription";
import { PropositionList } from "./PropositionList";
import { ColorList } from "./ColorList";
import { SizeList } from "./SizeList";
import { Fabric } from "./Fabric";
import { CategoryId } from "./CategoryId";

// Определение интерфейса для свойств объекта Item
export interface ItemProps {
  sizeList?: SizeList;
  colorList?: ColorList;
  description: ItemDescription;
  imagePathList: ImagePathList;
  propositionList?: PropositionList;
  title: string;
  price: number;
  sale: number;
  titleImagePath: string;
  fabric: Fabric;
  categoryId: CategoryId;
}

// Класс, представляющий Item
export class Item extends AggregateRoot<ItemProps> {
  get price(): number {
    return  this.props.price;
  }

  get sale(): number {
    return  this.props.sale;
  }

  get fabric(): Fabric {
    return  this.props.fabric;
  }

  get title(): string {
    return  this.props.title;
  }

  get titleImagePath(): string {
    return this.props.titleImagePath;
  }
  // Геттер для получения itemId
  get itemId(): ItemId {
    return ItemId.create(this._id).getValue() as ItemId;
  }

  // Геттер для получения images
  get imagePathList(): ImagePathList {
    return this.props.imagePathList as ImagePathList;
  }

  // Геттер для получения images
  get sizeList(): SizeList {
    return this.props.sizeList as SizeList;
  }

  // Геттер для получения images
  get colorList(): ColorList {
    return this.props.colorList as ColorList;
  }

  // Геттер для получения images
  get propositionList(): PropositionList {
    return this.props.propositionList as PropositionList;
  }

  // Геттер для получения description
  get description(): ItemDescription {
    return this.props.description;
  }

  // Геттер для получения description
  get categoryId(): CategoryId {
    return this.props.categoryId;
  }


  // Приватный конструктор, создает экземпляр Item
  private constructor(props: ItemProps, id?: UniqueEntityID) {
    super(props, id);
  }

  /**
   * Статический метод create используется для создания экземпляра класса Item.
   * @param props - Объект типа ItemProps с обязательными свойствами images и description.
   * @param id (опционально) - Уникальный идентификатор для создаваемого экземпляра Item.
   * @returns Результат типа Result<Item>. Если создание прошло успешно, содержит успешное значение экземпляра Item.
   *          В противном случае содержит ошибку, полученную при проверке свойств images и description.
   */
  public static create(props: ItemProps, id?: UniqueEntityID): Result<Item> {
    // Проверяем свойства images и description на null или undefined с помощью Guard
    const propsResult = Guard.againstNullOrUndefinedBulk([
      { argument: props?.imagePathList, argumentName: 'image_path_list' },
      { argument: props?.description, argumentName: 'description' },
      { argument: props?.title, argumentName: 'title' },
      { argument: props?.price, argumentName: 'price' },
      { argument: props?.titleImagePath, argumentName: 'title_image_path' },
      { argument: props?.sale, argumentName: 'sale' },
      { argument: props?.fabric, argumentName: 'fabric' },
      { argument: props?.categoryId, argumentName: 'category_id' },
    ]);

    // Если проверка проходит успешно, создаем новый экземпляр Item
    if (!propsResult.isSuccess) {
      return Result.fail<Item>(propsResult.getErrorValue());
    }

    // Создаем экземпляр Item с помощью приватного конструктора
    const item = new Item({ ...props }, id);

    // Возвращаем успешный результат с экземпляром Item
    return Result.ok<Item>(item);
  }
}
