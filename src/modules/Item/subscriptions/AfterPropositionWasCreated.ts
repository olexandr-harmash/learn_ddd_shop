
import { IHandle } from "../../../shared/domain/events/IHandle";
import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { PropositionWasCreated } from "../domain/events/PropositionWasCreated";
import { IDomainEvent } from "../../../shared/domain/events/IDomainEvent";


export class AfterPropositionWasCreated implements IHandle<PropositionWasCreated> {
  private updateItemReferences: any;

  constructor (updateItemReferences: any) {
    this.setupSubscriptions();
    this.updateItemReferences = updateItemReferences;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onPropositionWasCreated.bind(this) as (e: IDomainEvent) => void, PropositionWasCreated.name);
  }

  private onPropositionWasCreated (event: PropositionWasCreated) {

    try {
      //await this.updateItemReferences.execute({});
      console.log(`[AfterCommentPosted]: Updated post stats for {}`);
    } catch (err) {
      console.log(`[AfterCommentPosted]: Failed to update post stats for {}`);
    }
  }

}