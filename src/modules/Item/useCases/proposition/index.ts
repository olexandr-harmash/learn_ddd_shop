import { propositionRepositoryImpl } from "../../repositories";
import { CreatePropositionController } from "./CreatePropositionController"
import { CreatePropositionUseCase } from "./CreatePropositionUseCase"

const createPropositionUseCase = new CreatePropositionUseCase(propositionRepositoryImpl);
const createPropositionController = new CreatePropositionController(createPropositionUseCase);

export {
    createPropositionUseCase,
    createPropositionController
}