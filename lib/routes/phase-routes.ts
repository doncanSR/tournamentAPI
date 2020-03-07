import { PhaseController } from "../controllers/phase-controller";
import { Router } from 'express'

const phaseController : PhaseController = new PhaseController();
const phaseRoutes = Router()

  .get('/', phaseController.getPhase)
  .post('/', phaseController.addNewPhase)
  .put('/', phaseController.updatePhase)
  .delete('/', phaseController.deletePhase)
  .post('/finish-groups', phaseController.finishGroupsPhase)

export { phaseRoutes }