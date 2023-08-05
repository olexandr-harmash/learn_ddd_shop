import { ItemId } from "../../domain/ItemId";
import { Proposition } from "../../domain/Proposition";
import { PropositionId } from "../../domain/PropositionId";
import { PropositionList } from "../../domain/PropositionList";
import { PropositionMap } from "../../mappers/PropositionMap";
import { IPropositionRepository } from "../Proposition";

export class PropositionRepositoryImpl implements IPropositionRepository {
    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    getItemById(id: PropositionId): Promise<Proposition> {
        throw new Error("Method not implemented.");
    }
    getItem(id: PropositionId): Promise<Proposition> {
        throw new Error("Method not implemented.");
    }
    getItemDetail(id: PropositionId): Promise<Proposition> {
        throw new Error("Method not implemented.");
    }
    getItemsDetailList(filter: any): Promise<Proposition> {
        throw new Error("Method not implemented.");
    }

    private createBaseQuery(limit?: number, offset?: number): any {
        const models = this.models;
        return {
            where: {},
            include: [],
            limit,
            offset
        }
    }

    private createBaseDetailsQuery(limit?: number, offset?: number): any {
        const models = this.models;
        return {
            where: {},
            include: [
                {
                    model: models.Proposition,
                    as: 'Proposition',
                    include: [
                        { model: models.Quantity, as: 'Quantity' }
                    ]
                }
            ],
            limit,
            offset
        }
    }

    public async exists(propositionId: PropositionId): Promise<boolean> {
        const PropositionModel = this.models.Proposition;
        const baseQuery = this.createBaseQuery();
        baseQuery.where['proposition_id'] = propositionId.getStringValue();
        const proposition = await PropositionModel.findOne(baseQuery);
        const found = !!proposition === true;
        return found;
    }

    public delete(propositionId: PropositionId): Promise<void> {
        const PropositionModel = this.models.Proposition;
        return PropositionModel.destroy({ where: { proposition_id: propositionId.getStringValue() } });
    }

    async saveList(propositionList: PropositionList): Promise<PropositionList> {
        return PropositionList.create(
            await Promise.all(
                propositionList.getItems().map(
                    async (p) => {
                        const propositionOrNull = await this.save(p);
                        return propositionOrNull as Proposition;
                    }
                )
            )
        );
    }

    /**
     * TODO `Result` interface adaptive error throwing
     * When Proposition will be created we add associations between Item and Colors/Sizes
     * it are additional fields for Item model that simplfy seach without proposition table. 
     */
    public async save(proposition: Proposition): Promise<Proposition> {
        const PropositionModel = this.models.Proposition;
        const exists = await this.exists(proposition.propositionId);
        const isNewProposition = !exists;
        const rawSequelizeProposition = await PropositionMap.toPersistence(proposition);

        if (isNewProposition) {
            await PropositionModel.create(rawSequelizeProposition);

            return proposition;

        } else {
            // Save non-aggregate tables before saving the aggregate
            // so that any domain events on the aggregate get dispatched

            const propositionResult = await PropositionModel.update(rawSequelizeProposition, {
                // To make sure your hooks always run, make sure to include this in
                // the query
                individualHooks: true,
                hooks: true,
                where: { proposition_id: proposition.propositionId.getStringValue() }
            });

            return proposition;
        }
    }
}