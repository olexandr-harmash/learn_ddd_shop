
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { ItemId } from "../ItemId";
import { Proposition } from "../Proposition";

export class PropositionWasCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public proposition: Proposition;

  constructor (proposition: Proposition) {
    this.dateTimeOccurred = new Date();
    this.proposition = proposition;
  }
  
  getAggregateId (): UniqueEntityID {
    return this.proposition.id;
  }

  getItemId (): ItemId {
    return this.proposition.itemId;
  }
}